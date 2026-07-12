// ====== WebSocket Variables ======
let socket = null;
let reconnectAttempts = 0;
const maxReconnectAttempts = 5;
let adminId = document.getElementById('id_for_admin')?.textContent.trim();

// ====== Data Stores ======
let assigned = { project: [], task: [] };
let components = [];
let projects = [];
let tasks = [];
let projectUsersDict = {}; // Store users from project API
let taskUsersDict = {}; // Store users from task API
let projectStatusData = []; // Store projects from API
let taskStatusData = []; // Store tasks from API
let signUpRequests = []; // Store sign up requests from API

// Template variables from FastAPI
const templateData = {
    tp: window.tp || 0, // Total Projects
    pd: window.pd || 0, // Completed Projects
    tt: window.tt || 0, // Total Tasks
    td: window.td || 0, // Completed Tasks
    rp: window.rp || [], // Recent Projects
    rt: window.rt || []  // Recent Tasks
};

// ====== Members Data ======
let membersData = [];

// ====== Notification System ======
let notifications = [];

// ====== Delete Confirmation Variables ======
let deleteInProgress = false;
let currentDeleteItem = null;
let currentDeleteType = null;

// ====== Community Chat Variables ======
let communitySocket = null;
let currentAdminId = document.getElementById('id_for_admin')?.textContent.trim();

// ====== Filter Variables ======
window.projectFilter = 'all';
window.taskFilter = 'all';
window.memberFilter = 'all';

// ====== WebSocket Functions ======
function initializeWebSocket() {
    if (!adminId) {
        console.error('Admin ID not found for WebSocket connection');
        return;
    }

    try {
        // Determine WebSocket URL based on current location
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/websocket/ws/${adminId}`;

        socket = new WebSocket(wsUrl);

        socket.onopen = function (event) {
            console.log('WebSocket connected successfully for admin');
            updateConnectionStatus('connected', 'Connected');
            reconnectAttempts = 0;
        };

        socket.onmessage = function (event) {
            const data = JSON.parse(event.data);
            console.log('WebSocket message received:', data);

            if (data.type === 'notification') {
                handleNewNotification(data.notification);
            } else if (data.type === 'connected_users') {
                console.log('Connected users:', data.users);
            }
        };

        socket.onclose = function (event) {
            console.log('WebSocket disconnected:', event);
            updateConnectionStatus('disconnected', 'Disconnected');

            // Attempt to reconnect
            if (reconnectAttempts < maxReconnectAttempts) {
                setTimeout(() => {
                    reconnectAttempts++;
                    console.log(`Attempting to reconnect... (${reconnectAttempts}/${maxReconnectAttempts})`);
                    initializeWebSocket();
                }, 3000);
            }
        };

        socket.onerror = function (error) {
            console.error('WebSocket error:', error);
            updateConnectionStatus('disconnected', 'Connection Error');
        };

    } catch (error) {
        console.error('Error initializing WebSocket:', error);
        updateConnectionStatus('disconnected', 'Connection Failed');
    }
}

function updateConnectionStatus(status, text) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');

    if (indicator && statusText) {
        indicator.className = 'status-indicator';
        indicator.classList.add(`status-${status}`);
        statusText.textContent = text;
    }
}

// ====== Notification Functions ======
function handleNewNotification(notificationData) {
    const [message, status, timestamp] = notificationData;

    // Add to notifications array
    const newNotification = {
        id: notifications.length + 1,
        message: message,
        read: status === 1
    };

    notifications.unshift(newNotification);

    // Update notification badge
    updateNotificationBadge();

    // Show toast notification
    showToast(message, 'success');

    // If notification modal is open, update it
    const modal = document.getElementById('notificationModal');
    if (modal && modal.classList.contains('flex')) {
        renderNotifications();
    }

    // Play notification sound
    playNotificationSound();
}

function playNotificationSound() {
    // Create a simple notification sound
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
        console.log('Audio context not supported');
    }
}

function showToast(message, type) {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white font-medium z-50 ${type === 'success' ? 'bg-secondary' : 'bg-primary'
        }`;
    toast.textContent = message;
    document.body.appendChild(toast);

    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.getElementById('notificationBadge');

    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.classList.remove('hidden');
        } else {
            badge.classList.add('hidden');
        }
    }
}

// ====== Delete Confirmation Functions ======
function showDeleteConfirmation(itemId, itemName, itemType) {
    currentDeleteItem = itemId;
    currentDeleteType = itemType;

    const message = itemType === 'project'
        ? `Are you sure you want to delete the project "${itemName}"?`
        : `Are you sure you want to delete the task "${itemName}"?`;

    const messageElement = document.getElementById('deleteConfirmationMessage');
    const deleteBtnText = document.getElementById('deleteBtnText');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    if (messageElement) messageElement.textContent = message;
    if (deleteBtnText) deleteBtnText.textContent = 'Delete';
    if (confirmDeleteBtn) confirmDeleteBtn.disabled = false;

    toggleModal('deleteConfirmationModal', true);
}

function closeDeleteConfirmation() {
    toggleModal('deleteConfirmationModal', false);
    currentDeleteItem = null;
    currentDeleteType = null;
    deleteInProgress = false;
}

async function confirmDelete() {
    if (deleteInProgress || !currentDeleteItem || !currentDeleteType) return;

    deleteInProgress = true;
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const deleteBtnText = document.getElementById('deleteBtnText');

    if (confirmDeleteBtn) confirmDeleteBtn.disabled = true;
    if (deleteBtnText) deleteBtnText.innerHTML = '<div class="loading-spinner"></div> Deleting...';

    try {
        const endpoint = currentDeleteType === 'project' ? '/admin/projects/delete-project' : '/admin/tasks/delete-task';
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                x: currentDeleteItem
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result === true) {
            // Successfully deleted
            showToast(`${currentDeleteType.charAt(0).toUpperCase() + currentDeleteType.slice(1)} deleted successfully!`, 'success');

            // Remove from UI
            if (currentDeleteType === 'project') {
                // Remove project from projectStatusData
                projectStatusData = projectStatusData.filter(p => p.project_id !== currentDeleteItem);
                renderProjectStatus();
            } else {
                // Remove task from taskStatusData
                taskStatusData = taskStatusData.filter(t => t.task_id !== currentDeleteItem);
                renderTaskStatus();
            }

            closeDeleteConfirmation();
        } else {
            throw new Error('Deletion failed on server');
        }
    } catch (error) {
        console.error(`Error deleting ${currentDeleteType}:`, error);
        showToast(`Failed to delete ${currentDeleteType}. Please try again.`, 'error');
        if (deleteBtnText) deleteBtnText.textContent = 'Delete';
        if (confirmDeleteBtn) confirmDeleteBtn.disabled = false;
        deleteInProgress = false;
    }
}

// ====== Notification API Functions ======
async function fetchNotificationsFromAPI() {
    try {
        const loadingElement = document.getElementById('signUpRequestsLoading');
        const listElement = document.getElementById('signUpRequestsList');

        if (loadingElement) loadingElement.classList.remove('hidden');
        if (listElement) listElement.innerHTML = '';

        const response = await fetch('/admin/dashboard/notification-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                x: "any string value"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform the API response into our notifications format
        notifications = data.map((notification, index) => {
            return {
                id: index + 1,
                message: notification[0],
                read: notification[1] === 1
            };
        });

        // Update notification badge to zero when clicked
        const badge = document.getElementById('notificationBadge');
        if (badge) badge.classList.add('hidden');

        return notifications;
    } catch (error) {
        console.error('Error fetching notifications from API:', error);
        const loadingElement = document.getElementById('signUpRequestsLoading');
        if (loadingElement) loadingElement.classList.add('hidden');
        alert('Failed to load notifications from server.');
        return [];
    }
}

async function openNotificationModal() {
    await fetchNotificationsFromAPI();
    renderNotifications();
    toggleModal('notificationModal', true);
}

function closeNotificationModal() {
    toggleModal('notificationModal', false);
}

function renderNotifications() {
    const container = document.getElementById('notificationsList');
    const noNotifications = document.getElementById('noNotifications');

    if (!container || !noNotifications) return;

    container.innerHTML = '';

    if (notifications.length === 0) {
        noNotifications.classList.remove('hidden');
        container.classList.add('hidden');
        return;
    }

    noNotifications.classList.add('hidden');
    container.classList.remove('hidden');

    notifications.forEach(notification => {
        const notificationEl = document.createElement('div');
        notificationEl.className = `notification-item ${!notification.read ? 'notification-unread' : ''}`;

        // Determine icon based on read status
        const iconClass = !notification.read ? 'notification-icon-unread' : 'notification-icon-read';
        const icon = !notification.read ? 'fa-times' : 'fa-check';

        notificationEl.innerHTML = `
            <div class="notification-icon-container ${iconClass}">
                <i class="fas ${icon}"></i>
            </div>
            <div class="notification-content">
                <div class="text-sm text-zinc-800">${notification.message}</div>
            </div>
        `;

        container.appendChild(notificationEl);
    });
}

// ====== Member's Profile Functions ======
async function fetchMembersFromAPI() {
    try {
        const loadingElement = document.getElementById('membersProfileLoading');
        const membersList = document.getElementById('membersList');

        if (loadingElement) loadingElement.classList.remove('hidden');
        if (membersList) membersList.innerHTML = '';

        const response = await fetch('/admin/profiles/mps', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                x: "any string value"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Transform the API response into our membersData format
        membersData = Object.entries(data).map(([email, memberInfo], index) => {
            // Process assignedProjects to separate assigned projects and manager projects
            const assignedProjects = [];
            const managerProjects = [];

            if (memberInfo.assignedProjects && Array.isArray(memberInfo.assignedProjects)) {
                memberInfo.assignedProjects.forEach(project => {
                    if (Array.isArray(project) && project.length >= 2) {
                        const projectName = project[0];
                        const isManager = project[1];

                        assignedProjects.push(projectName);

                        if (isManager === true) {
                            managerProjects.push(projectName);
                        }
                    }
                });
            }

            return {
                id: index + 1,
                fullName: memberInfo.name || "Unknown",
                email: email,
                phone: memberInfo.phone || "Not provided",
                lastActive: memberInfo.lastActive || "Unknown",
                team: memberInfo.team || "Not assigned",
                role: memberInfo.role || "Employee",
                assignedProjects: assignedProjects,
                assignedTasks: memberInfo.assignedTask || [],
                managerProjects: managerProjects,
                techStack: memberInfo.techStack || []
            };
        });

        renderMembers();
        if (loadingElement) loadingElement.classList.add('hidden');
        return membersData;
    } catch (error) {
        console.error('Error fetching members from API:', error);
        const loadingElement = document.getElementById('membersProfileLoading');
        if (loadingElement) loadingElement.classList.add('hidden');
        alert('Failed to load members from server.');
        return [];
    }
}

function renderMembers() {
    const list = document.getElementById('membersList');
    if (!list) return;

    list.innerHTML = '';

    let filteredMembers = membersData;
    if (window.memberFilter && window.memberFilter !== 'all') {
        // Convert filter to match API team values
        let teamFilter = window.memberFilter;
        if (teamFilter === 'Dev Team') teamFilter = 'Dev';
        if (teamFilter === 'Design Team') teamFilter = 'Design';
        if (teamFilter === 'Marketing Team') teamFilter = 'Marketing';

        filteredMembers = membersData.filter(member => member.team === teamFilter);
    }

    if (filteredMembers.length === 0) {
        list.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-8 text-center text-zinc-500">
                    No members found
                </td>
            </tr>
        `;
        return;
    }

    filteredMembers.forEach(member => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-zinc-50';

        // Determine team display name and color
        let teamDisplay = member.team;
        let teamColorClass = 'bg-zinc-100 text-zinc-600';

        if (member.team === 'Dev') {
            teamDisplay = 'Dev Team';
            teamColorClass = 'bg-primary/20 text-primary';
        } else if (member.team === 'Design') {
            teamDisplay = 'Design Team';
            teamColorClass = 'bg-purple-500/10 text-purple-600';
        } else if (member.team === 'Marketing') {
            teamDisplay = 'Marketing Team';
            teamColorClass = 'bg-secondary/20 text-secondary';
        }

        // Determine role color
        let roleColorClass = 'bg-zinc-100 text-zinc-600';
        if (member.role === 'Manager') {
            roleColorClass = 'bg-yellow-500/10 text-yellow-600';
        } else if (member.role === 'Employee') {
            roleColorClass = 'bg-secondary/20 text-secondary';
        } else if (member.role === 'Intern') {
            roleColorClass = 'bg-zinc-100 text-zinc-600';
        }

        row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="ml-4">
                        <div class="text-sm font-medium text-zinc-800">${member.fullName}</div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-sm text-zinc-600">${member.email}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teamColorClass}">
                    ${teamDisplay}
                </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleColorClass}">
                    ${member.role}
                </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <button onclick="openMemberDetailsModal(${member.id})" class="text-secondary hover:text-primary">View Details</button>
            </td>
        `;

        list.appendChild(row);
    });
}

function openMemberDetailsModal(memberId) {
    const member = membersData.find(m => m.id === memberId);
    if (!member) return;

    const titleElement = document.getElementById('memberDetailsTitle');
    if (titleElement) titleElement.textContent = `Member Details: ${member.fullName}`;

    document.getElementById('detailFullName').textContent = member.fullName;
    document.getElementById('detailEmail').textContent = member.email;
    document.getElementById('detailPhone').textContent = member.phone;
    document.getElementById('detailLastActive').textContent = member.lastActive;

    // Determine team display name
    let teamDisplay = member.team;
    if (member.team === 'Dev') teamDisplay = 'Dev Team';
    else if (member.team === 'Design') teamDisplay = 'Design Team';
    else if (member.team === 'Marketing') teamDisplay = 'Marketing Team';

    document.getElementById('detailTeam').textContent = teamDisplay;
    document.getElementById('detailRole').textContent = member.role;

    // Tech Stack
    const techStackContainer = document.getElementById('detailTechStack');
    if (techStackContainer) {
        techStackContainer.innerHTML = '';
        if (member.techStack && member.techStack.length > 0) {
            member.techStack.forEach(tech => {
                const span = document.createElement('span');
                span.className = 'tech-stack-tag';
                span.textContent = tech;
                techStackContainer.appendChild(span);
            });
        } else {
            techStackContainer.innerHTML = '<span class="text-zinc-400 text-sm">No tech stack specified</span>';
        }
    }

    // Assigned Projects
    const assignedProjectsList = document.getElementById('detailAssignedProjects');
    if (assignedProjectsList) {
        assignedProjectsList.innerHTML = '';
        if (member.assignedProjects && member.assignedProjects.length > 0) {
            member.assignedProjects.forEach(project => {
                const li = document.createElement('li');
                li.className = 'text-sm text-zinc-800';
                li.textContent = project;
                assignedProjectsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.className = 'text-sm text-zinc-500 italic';
            li.textContent = 'No projects assigned';
            assignedProjectsList.appendChild(li);
        }
    }

    // Assigned Tasks
    const assignedTasksList = document.getElementById('detailAssignedTasks');
    if (assignedTasksList) {
        assignedTasksList.innerHTML = '';
        if (member.assignedTasks && member.assignedTasks.length > 0) {
            member.assignedTasks.forEach(task => {
                const li = document.createElement('li');
                li.className = 'text-sm text-zinc-800';
                li.textContent = task;
                assignedTasksList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.className = 'text-sm text-zinc-500 italic';
            li.textContent = 'No tasks assigned';
            assignedTasksList.appendChild(li);
        }
    }

    // Manager Projects
    const managerProjectsList = document.getElementById('detailManagerProjects');
    if (managerProjectsList) {
        managerProjectsList.innerHTML = '';
        if (member.managerProjects && member.managerProjects.length > 0) {
            member.managerProjects.forEach(project => {
                const li = document.createElement('li');
                li.className = 'text-sm text-zinc-800';
                li.textContent = project;
                managerProjectsList.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.className = 'text-sm text-zinc-500 italic';
            li.textContent = 'No projects managed';
            managerProjectsList.appendChild(li);
        }
    }

    toggleModal('memberDetailsModal', true);
}

function closeMemberDetailsModal() {
    toggleModal('memberDetailsModal', false);
}

// ====== FastAPI Integration for Sign Up Requests ======
async function fetchSignUpRequestsFromAPI() {
    try {
        // Show loading state
        const loadingElement = document.getElementById('signUpRequestsLoading');
        const listElement = document.getElementById('signUpRequestsList');

        if (loadingElement) loadingElement.classList.remove('hidden');
        if (listElement) listElement.innerHTML = '';

        // Send POST request to FastAPI endpoint
        const response = await fetch('/admin/pendings/approve-signups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                x: "any string value"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Store the sign up requests data
        signUpRequests = data;

        // Render the sign up requests
        renderSignUpRequests();

        // Hide loading
        if (loadingElement) loadingElement.classList.add('hidden');

        return data;
    } catch (error) {
        console.error('Error fetching sign up requests from API:', error);
        const loadingElement = document.getElementById('signUpRequestsLoading');
        if (loadingElement) loadingElement.classList.add('hidden');
        alert('Failed to load sign up requests from server.');
        return [];
    }
}

// ====== Send Action to Server ======
async function sendUserAction(email, action) {
    try {
        // Send POST request to FastAPI endpoint
        const response = await fetch('/admin/pendings/action-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                action: action
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        // Refresh the sign up requests after action
        await fetchSignUpRequestsFromAPI();

        // Show success message
        if (action === 1) {
            alert(`User ${email} has been approved successfully!`);
        } else {
            alert(`User ${email} has been rejected successfully!`);
        }

        return result;
    } catch (error) {
        console.error('Error sending user action to API:', error);
        alert('Failed to process user action. Please try again.');
        return null;
    }
}

// ====== Initialize Dashboard with Template Data ======
function initializeDashboard() {
    // Update dashboard stats
    const totalProjects = document.getElementById('totalProjects');
    const completedProjects = document.getElementById('completedProjects');
    const totalTasks = document.getElementById('totalTasks');
    const completedTasks = document.getElementById('completedTasks');

    if (totalProjects) totalProjects.textContent = templateData.tp || 0;
    if (completedProjects) completedProjects.textContent = templateData.pd || 0;
    if (totalTasks) totalTasks.textContent = templateData.tt || 0;
    if (completedTasks) completedTasks.textContent = templateData.td || 0;

    // Render recent projects and tasks
    renderRecentProjects();
    renderRecentTasks();

    // Initialize notification badge
    updateNotificationBadge();
}

// ====== Render Recent Projects from Template ======
function renderRecentProjects() {
    const container = document.getElementById('recentProjects');
    if (!container) return;

    container.innerHTML = '';

    const recentProjects = templateData.rp || [];

    if (recentProjects.length === 0) {
        container.innerHTML = '<p class="text-zinc-400 text-center py-4">No recent projects</p>';
        return;
    }

    recentProjects.forEach(project => {
        const projectEl = document.createElement('div');
        projectEl.className = 'flex justify-between items-center p-3 border border-zinc-200/80 rounded-lg';

        projectEl.innerHTML = `
            <div>
                <h4 class="font-medium text-zinc-800">${project.project_name}</h4>
                <p class="text-sm text-zinc-500">${project.team} • Started: ${project.initiated_date}</p>
            </div>
            <span class="status-tag ${project.Status === 0 ? 'status-ongoing' : 'status-completed'}">
                ${project.Status === 0 ? 'ongoing' : 'completed'}
            </span>
        `;

        container.appendChild(projectEl);
    });
}

// ====== Render Recent Tasks from Template ======
function renderRecentTasks() {
    const container = document.getElementById('recentTasks');
    if (!container) return;

    container.innerHTML = '';

    const recentTasks = templateData.rt || [];

    if (recentTasks.length === 0) {
        container.innerHTML = '<p class="text-zinc-400 text-center py-4">No recent tasks</p>';
        return;
    }

    recentTasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = 'flex justify-between items-center p-3 border border-zinc-200/80 rounded-lg';

        taskEl.innerHTML = `
            <div>
                <h4 class="font-medium text-zinc-800">${task.task_name}</h4>
                <p class="text-sm text-zinc-500">Due: ${task.due_date}</p>
            </div>
            <span class="status-tag ${task.Status === 0 ? 'status-ongoing' : 'status-completed'}">
                ${task.Status === 0 ? 'ongoing' : 'completed'}
            </span>
        `;

        container.appendChild(taskEl);
    });
}

// ====== Render Sign Up Requests from API ======
function renderSignUpRequests() {
    const list = document.getElementById('signUpRequestsList');
    const pendingCountElement = document.getElementById('pendingRequestsCount');

    if (!list) return;

    list.innerHTML = '';

    // Count pending requests (action = -1)
    const pendingCount = signUpRequests.filter(req => req.action === -1).length;
    if (pendingCountElement) pendingCountElement.textContent = pendingCount;

    if (signUpRequests.length === 0) {
        list.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 py-8 text-center text-zinc-500">
                    No sign up requests found
                </td>
            </tr>
        `;
        return;
    }

    signUpRequests.forEach(request => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-zinc-50';

        // Determine action buttons based on action value
        let actionButtons = '';
        if (request.action === -1) {
            // Pending - show both Approve and Reject buttons
            actionButtons = `
                <button onclick="approveUser('${request.email}')" class="text-secondary hover:text-primary mr-3 font-medium">Approve</button>
                <button onclick="rejectUser('${request.email}')" class="text-primary hover:text-secondary font-medium">Reject</button>
            `;
        } else if (request.action === 1) {
            // Approved - show approved status
            actionButtons = '<span class="status-approved px-2 py-1 rounded-full text-xs font-medium">Approved</span>';
        } else if (request.action === 0) {
            // Rejected - show rejected status
            actionButtons = '<span class="status-rejected px-2 py-1 rounded-full text-xs font-medium">Rejected</span>';
        }

        row.innerHTML = `
            <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="ml-4">
                        <div class="text-sm font-medium text-zinc-800">${request.fullname}</div>
                    </div>
                </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-sm text-zinc-600">${request.email}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-sm text-zinc-600">${request.phone_number}</div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${request.role === 'manager' ? 'bg-purple-500/10 text-purple-600' :
                request.role === 'intern' ? 'bg-secondary/20 text-secondary' :
                    'bg-primary/20 text-primary'}">
                    ${request.role}
                </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                ${actionButtons}
            </td>
        `;

        list.appendChild(row);
    });
}

// ====== User Action Functions ======
async function approveUser(email) {
    if (confirm('Are you sure you want to approve this user?')) {
        await sendUserAction(email, 1);
    }
}

async function rejectUser(email) {
    if (confirm('Are you sure you want to reject this user?')) {
        await sendUserAction(email, 0);
    }
}

// ====== FastAPI Integration for Task Status ======
async function fetchTaskStatusFromAPI() {
    try {
        const loadingElement = document.getElementById('taskStatusLoading');
        const listElement = document.getElementById('taskStatusList');

        if (loadingElement) loadingElement.classList.remove('hidden');
        if (listElement) listElement.innerHTML = '';

        const response = await fetch('/admin/tasks/show-task-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                x: "any string value"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        taskStatusData = data;
        renderTaskStatus();
        if (loadingElement) loadingElement.classList.add('hidden');
        return data;
    } catch (error) {
        console.error('Error fetching task status from API:', error);
        const loadingElement = document.getElementById('taskStatusLoading');
        if (loadingElement) loadingElement.classList.add('hidden');
        alert('Failed to load tasks from server.');
        return [];
    }
}

// ====== Task Details Modal ======
function openTaskDetailsModal(taskIndex) {
    const task = taskStatusData[taskIndex];
    if (!task) return;

    const titleElement = document.getElementById('taskDetailsTitle');
    if (titleElement) titleElement.textContent = `Task Details: ${task.task_name}`;

    document.getElementById('detailTaskName').textContent = task.task_name;
    document.getElementById('detailTaskDescription').textContent = task.desc;
    document.getElementById('detailTaskInitiatedDate').textContent = task.initiated_date;
    document.getElementById('detailTaskDueDate').textContent = task.due_date;

    const statusElement = document.getElementById('detailTaskStatus');
    if (statusElement) {
        statusElement.textContent = task.Status === 0 ? 'ongoing' : 'completed';
        statusElement.className = `status-tag ${task.Status === 0 ? 'status-ongoing' : 'status-completed'}`;
    }

    toggleModal('taskDetailsModal', true);
}

function closeTaskDetailsModal() {
    toggleModal('taskDetailsModal', false);
}

// ====== FastAPI Integration for Project Status ======
async function fetchProjectStatusFromAPI() {
    try {
        const loadingElement = document.getElementById('projectStatusLoading');
        const listElement = document.getElementById('projectStatusList');

        if (loadingElement) loadingElement.classList.remove('hidden');
        if (listElement) listElement.innerHTML = '';

        const response = await fetch('/admin/projects/show-project-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                x: "any string value"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        projectStatusData = data;
        renderProjectStatus();
        if (loadingElement) loadingElement.classList.add('hidden');
        return data;
    } catch (error) {
        console.error('Error fetching project status from API:', error);
        const loadingElement = document.getElementById('projectStatusLoading');
        if (loadingElement) loadingElement.classList.add('hidden');
        alert('Failed to load projects from server.');
        return [];
    }
}

// ====== Project Details Modal ======
function openProjectDetailsModal(projectIndex) {
    const project = projectStatusData[projectIndex];
    if (!project) return;

    const titleElement = document.getElementById('projectDetailsTitle');
    if (titleElement) titleElement.textContent = `Project Details: ${project.project_name}`;

    document.getElementById('detailProjectName').textContent = project.project_name;
    document.getElementById('detailInitiatedDate').textContent = project.initiated_date;
    document.getElementById('detailDueDate').textContent = project.due_date;
    document.getElementById('detailTeam').textContent = project.team;

    const statusElement = document.getElementById('detailStatus');
    if (statusElement) {
        statusElement.textContent = project.Status === 0 ? 'ongoing' : 'completed';
        statusElement.className = `status-tag ${project.Status === 0 ? 'status-ongoing' : 'status-completed'}`;
    }

    const projectManagerElement = document.getElementById('detailProjectManager');
    if (projectManagerElement && project.project_manager && project.project_manager[0] && project.project_manager[0][1]) {
        projectManagerElement.textContent = project.project_manager[0][1];
    } else if (projectManagerElement) {
        projectManagerElement.textContent = 'Not assigned';
    }

    const assignedMembersList = document.getElementById('detailAssignedMembers');
    if (assignedMembersList) {
        assignedMembersList.innerHTML = '';
        if (project.assigned_member && Array.isArray(project.assigned_member)) {
            project.assigned_member.forEach(member => {
                const li = document.createElement('li');
                li.className = 'text-sm'; // Keep base class

                try {
                    li.textContent = member[1];

                    // Check for color conditions
                    if (member[2] === 0) {
                        li.style.color = 'red';
                        li.title = `${member[1]} has not completed the project yet`;
                    } else {
                        li.style.color = 'green';
                        li.title = `${member[1]} has completed the project`;
                    }
                } catch (error) {
                    // If index error or any other occurs
                    li.style.color = 'var(--foreground)';
                    li.textContent = member[1] || 'Unknown Member';
                    li.title = 'Status unavailable';
                }

                assignedMembersList.appendChild(li);
            });
        }
    }

    const componentsContainer = document.getElementById('detailComponents');
    if (componentsContainer) {
        componentsContainer.innerHTML = '';
        if (project.components && typeof project.components === 'object') {
            Object.entries(project.components).forEach(([heading, details]) => {
                const componentDiv = document.createElement('div');
                componentDiv.className = 'border border-zinc-200/80 p-3 rounded';
                componentDiv.innerHTML = `
                    <h5 class="font-semibold text-zinc-800">${heading}</h5>
                    <p class="text-sm text-zinc-500 mt-1">${details}</p>
                `;
                componentsContainer.appendChild(componentDiv);
            });
        }
    }

    toggleModal('projectDetailsModal', true);
}

function closeProjectDetailsModal() {
    toggleModal('projectDetailsModal', false);
}

// ====== FastAPI Integration for Projects ======
async function fetchProjectUsersFromAPI() {
    try {
        const loadingElement = document.getElementById('projectMembersLoading');
        const membersElement = document.getElementById('projectMembers');

        if (loadingElement) loadingElement.classList.remove('hidden');
        if (membersElement) membersElement.classList.add('hidden');

        const response = await fetch('/admin/dashboard/load-add-project', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                x: "any string value"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        projectUsersDict = data;
        populateProjectUserDropdowns();

        if (loadingElement) loadingElement.classList.add('hidden');
        if (membersElement) membersElement.classList.remove('hidden');

        return data;
    } catch (error) {
        console.error('Error fetching users from project API:', error);
        const loadingElement = document.getElementById('projectMembersLoading');
        if (loadingElement) loadingElement.classList.add('hidden');
        alert('Failed to load users from server.');
        return {};
    }
}

function populateProjectUserDropdowns() {
    const projectMembersSelect = document.getElementById('projectMembers');
    const projectManagerSelect = document.getElementById('projectManager');

    if (!projectMembersSelect || !projectManagerSelect) return;

    projectMembersSelect.innerHTML = '';
    projectManagerSelect.innerHTML = '<option value="">Select Manager</option>';

    Object.entries(projectUsersDict).forEach(([email, username]) => {
        const memberOption = document.createElement('option');
        memberOption.value = email;
        memberOption.textContent = username;
        projectMembersSelect.appendChild(memberOption);

        const managerOption = document.createElement('option');
        managerOption.value = email;
        managerOption.textContent = username;
        projectManagerSelect.appendChild(managerOption);
    });
}

// ====== FastAPI Integration for Tasks ======
async function fetchTaskUsersFromAPI() {
    try {
        const loadingElement = document.getElementById('taskMembersLoading');
        const membersElement = document.getElementById('taskMembers');

        if (loadingElement) loadingElement.classList.remove('hidden');
        if (membersElement) membersElement.classList.add('hidden');

        const response = await fetch('/admin/dashboard/load-add-task', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                x: "any string value"
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        taskUsersDict = data;
        populateTaskUserDropdowns();

        if (loadingElement) loadingElement.classList.add('hidden');
        if (membersElement) membersElement.classList.remove('hidden');

        return data;
    } catch (error) {
        console.error('Error fetching users from task API:', error);
        const loadingElement = document.getElementById('taskMembersLoading');
        if (loadingElement) loadingElement.classList.add('hidden');
        alert('Failed to load users from server.');
        return {};
    }
}

function populateTaskUserDropdowns() {
    const taskMembersSelect = document.getElementById('taskMembers');
    if (!taskMembersSelect) return;

    taskMembersSelect.innerHTML = '';

    Object.entries(taskUsersDict).forEach(([email, username]) => {
        const memberOption = document.createElement('option');
        memberOption.value = email;
        memberOption.textContent = username;
        taskMembersSelect.appendChild(memberOption);
    });
}

// ====== Tab Navigation Functions ======
function setActiveProjectFilter(filter) {
    const allProjectsBtn = document.getElementById('allProjectsBtn');
    const ongoingProjectsBtn = document.getElementById('ongoingProjectsBtn');
    const completedProjectsBtn = document.getElementById('completedProjectsBtn');

    if (!allProjectsBtn || !ongoingProjectsBtn || !completedProjectsBtn) return;

    allProjectsBtn.classList.remove('bg-primary/20', 'text-primary');
    ongoingProjectsBtn.classList.remove('bg-primary/20', 'text-primary');
    completedProjectsBtn.classList.remove('bg-primary/20', 'text-primary');

    allProjectsBtn.classList.add('bg-zinc-100', 'text-zinc-600');
    ongoingProjectsBtn.classList.add('bg-zinc-100', 'text-zinc-600');
    completedProjectsBtn.classList.add('bg-zinc-100', 'text-zinc-600');

    if (filter === 'all') {
        allProjectsBtn.classList.remove('bg-zinc-100', 'text-zinc-600');
        allProjectsBtn.classList.add('bg-primary/20', 'text-primary');
    } else if (filter === 'ongoing') {
        ongoingProjectsBtn.classList.remove('bg-zinc-100', 'text-zinc-600');
        ongoingProjectsBtn.classList.add('bg-primary/20', 'text-primary');
    } else if (filter === 'completed') {
        completedProjectsBtn.classList.remove('bg-zinc-100', 'text-zinc-600');
        completedProjectsBtn.classList.add('bg-primary/20', 'text-primary');
    }

    window.projectFilter = filter;
}

function setActiveTaskFilter(filter) {
    const allTasksBtn = document.getElementById('allTasksBtn');
    const ongoingTasksBtn = document.getElementById('ongoingTasksBtn');
    const completedTasksBtn = document.getElementById('completedTasksBtn');

    if (!allTasksBtn || !ongoingTasksBtn || !completedTasksBtn) return;

    allTasksBtn.classList.remove('bg-primary/20', 'text-primary');
    ongoingTasksBtn.classList.remove('bg-primary/20', 'text-primary');
    completedTasksBtn.classList.remove('bg-primary/20', 'text-primary');

    allTasksBtn.classList.add('bg-zinc-100', 'text-zinc-600');
    ongoingTasksBtn.classList.add('bg-zinc-100', 'text-zinc-600');
    completedTasksBtn.classList.add('bg-zinc-100', 'text-zinc-600');

    if (filter === 'all') {
        allTasksBtn.classList.remove('bg-zinc-100', 'text-zinc-600');
        allTasksBtn.classList.add('bg-primary/20', 'text-primary');
    } else if (filter === 'ongoing') {
        ongoingTasksBtn.classList.remove('bg-zinc-100', 'text-zinc-600');
        ongoingTasksBtn.classList.add('bg-primary/20', 'text-primary');
    } else if (filter === 'completed') {
        completedTasksBtn.classList.remove('bg-zinc-100', 'text-zinc-600');
        completedTasksBtn.classList.add('bg-primary/20', 'text-primary');
    }

    window.taskFilter = filter;
}

function setActiveMemberFilter(filter) {
    const allMembersBtn = document.getElementById('allMembersBtn');
    const devTeamBtn = document.getElementById('devTeamBtn');
    const designTeamBtn = document.getElementById('designTeamBtn');
    const marketingTeamBtn = document.getElementById('marketingTeamBtn');

    if (!allMembersBtn || !devTeamBtn || !designTeamBtn || !marketingTeamBtn) return;

    allMembersBtn.classList.remove('bg-primary/20', 'text-primary');
    devTeamBtn.classList.remove('bg-primary/20', 'text-primary');
    designTeamBtn.classList.remove('bg-primary/20', 'text-primary');
    marketingTeamBtn.classList.remove('bg-primary/20', 'text-primary');

    allMembersBtn.classList.add('bg-zinc-100', 'text-zinc-600');
    devTeamBtn.classList.add('bg-zinc-100', 'text-zinc-600');
    designTeamBtn.classList.add('bg-zinc-100', 'text-zinc-600');
    marketingTeamBtn.classList.add('bg-zinc-100', 'text-zinc-600');

    if (filter === 'all') {
        allMembersBtn.classList.remove('bg-zinc-100', 'text-zinc-600');
        allMembersBtn.classList.add('bg-primary/20', 'text-primary');
    } else if (filter === 'Dev Team') {
        devTeamBtn.classList.remove('bg-zinc-100', 'text-zinc-600');
        devTeamBtn.classList.add('bg-primary/20', 'text-primary');
    } else if (filter === 'Design Team') {
        designTeamBtn.classList.remove('bg-zinc-100', 'text-zinc-600');
        designTeamBtn.classList.add('bg-primary/20', 'text-primary');
    } else if (filter === 'Marketing Team') {
        marketingTeamBtn.classList.remove('bg-zinc-100', 'text-zinc-600');
        marketingTeamBtn.classList.add('bg-primary/20', 'text-primary');
    }

    window.memberFilter = filter;
}

function showSection(sectionId) {
    // Hide all sections
    const sections = ['dashboardSection', 'signUpRequestsSection', 'projectStatusSection',
        'taskStatusSection', 'membersProfileSection', 'communitySection'];

    sections.forEach(id => {
        const section = document.getElementById(id);
        if (section) section.classList.add('hidden');
    });

    // Show the selected section
    const section = document.getElementById(sectionId);
    if (section) section.classList.remove('hidden');

    // Update active tab
    const tabIds = {
        'dashboardSection': 'dashboardBtn',
        'signUpRequestsSection': 'approveSignUpsBtn',
        'projectStatusSection': 'showProjectStatusBtn',
        'taskStatusSection': 'showTaskStatusBtn',
        'membersProfileSection': 'membersProfileBtn',
        'communitySection': 'communityBtn'
    };

    // Remove active class from all tabs
    Object.values(tabIds).forEach(btnId => {
        const btn = document.getElementById(btnId);
        if (btn) btn.classList.remove('active-tab');
    });

    // Add active class to the selected tab
    const activeBtnId = tabIds[sectionId];
    if (activeBtnId) {
        const activeBtn = document.getElementById(activeBtnId);
        if (activeBtn) activeBtn.classList.add('active-tab');
    }

    // Handle special section behaviors
    if (sectionId === 'communitySection') {
        loadCommunityChat();
        initializeCommunityWebSocket();
    }
}

// ====== Render Project Status ======
function renderProjectStatus() {
    const list = document.getElementById('projectStatusList');
    if (!list) return;

    list.innerHTML = '';

    let filteredProjects = projectStatusData;
    if (window.projectFilter === 'ongoing') {
        filteredProjects = projectStatusData.filter(p => p.Status === 0);
    } else if (window.projectFilter === 'completed') {
        filteredProjects = projectStatusData.filter(p => p.Status === 1);
    }

    filteredProjects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'valorant-card p-5 card-hover';
        card.id = project.project_id;

        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-bold text-zinc-800">${project.project_name}</h3>
                <span class="status-tag ${project.Status === 0 ? 'status-ongoing' : 'status-completed'}">
                    ${project.Status === 0 ? 'ongoing' : 'completed'}
                </span>
            </div>
            <div class="text-sm text-zinc-500 space-y-1">
                <div class="flex justify-between">
                    <span>Initiated Date:</span>
                    <span class="font-medium">${project.initiated_date}</span>
                </div>
                <div class="flex justify-between">
                    <span>Due Date:</span>
                    <span class="font-medium">${project.due_date}</span>
                </div>
                <div class="flex justify-between">
                    <span>Team:</span>
                    <span class="font-medium">${project.team}</span>
                </div>
            </div>
            <div class="mt-4 flex justify-between items-center">
                <button onclick="showDeleteConfirmation('${project.project_id}', '${project.project_name}', 'project')" class="text-red-500 hover:text-red-400 text-sm" title="Delete Project">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <button onclick="openProjectDetailsModal(${index})" class="text-secondary hover:text-primary text-sm font-medium">View Details</button>
            </div>
        `;

        list.appendChild(card);
    });
}

// ====== Render Task Status ======
function renderTaskStatus() {
    const list = document.getElementById('taskStatusList');
    if (!list) return;

    list.innerHTML = '';

    let filteredTasks = taskStatusData;
    if (window.taskFilter === 'ongoing') {
        filteredTasks = taskStatusData.filter(t => t.Status === 0);
    } else if (window.taskFilter === 'completed') {
        filteredTasks = taskStatusData.filter(t => t.Status === 1);
    }

    filteredTasks.forEach((task, index) => {
        const card = document.createElement('div');
        card.className = 'valorant-card p-5 card-hover';
        card.id = task.task_id;

        // Safely handle assigned_members
        let assignedMembersHTML = '';
        if (task.assigned_members && Array.isArray(task.assigned_members)) {
            assignedMembersHTML = task.assigned_members.map(member => {
                const name = member?.[1] || 'Unknown';
                const status = member?.[2];

                let color = 'text-zinc-600';
                let tooltip = 'Not updated yet';

                if (status === 0) {
                    color = 'text-red-500';
                    tooltip = `${name} has not completed the task yet`;
                } else if (status !== undefined) {
                    color = 'text-green-500';
                    tooltip = `${name} has completed the task`;
                }

                return `
                    <span class="bg-zinc-100 px-2 py-1 rounded text-sm ${color}" title="${tooltip}">
                        ${name}
                    </span>
                `;
            }).join('');
        }

        card.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <h3 class="font-bold text-zinc-800">${task.task_name}</h3>
                <span class="status-tag ${task.Status === 0 ? 'status-ongoing' : 'status-completed'}">
                    ${task.Status === 0 ? 'ongoing' : 'completed'}
                </span>
            </div>
            <div class="text-sm text-zinc-500 space-y-2 mb-4">
                <div class="flex justify-between">
                    <span>Initiated Date:</span>
                    <span class="font-medium">${task.initiated_date}</span>
                </div>
                <div class="flex justify-between">
                    <span>Due Date:</span>
                    <span class="font-medium">${task.due_date}</span>
                </div>
            </div>
            <div>
                <div class="text-sm text-zinc-500 mb-2">Assigned To:</div>
                <div class="flex flex-wrap gap-2">
                    ${assignedMembersHTML || '<span class="text-sm text-zinc-400">No members assigned</span>'}
                </div>
            </div>
            <div class="mt-4 flex justify-between items-center">
                <button onclick="showDeleteConfirmation('${task.task_id}', '${task.task_name}', 'task')" class="text-red-500 hover:text-red-400 text-sm" title="Delete Task">
                    <i class="fas fa-trash-alt"></i>
                </button>
                <button onclick="openTaskDetailsModal(${index})" class="text-secondary hover:text-primary text-sm font-medium">View Details</button>
            </div>
        `;

        list.appendChild(card);
    });
}

// ====== Helper Functions ======
function getCurrentDateFormatted() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}

function getCurrentTime() {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ====== Modal Utilities ======
function toggleModal(id, show = true) {
    const modal = document.getElementById(id);
    if (!modal) return;

    if (show) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
    } else {
        modal.classList.remove('flex');
        modal.classList.add('hidden');
    }
}

// ====== Project Modals ======
async function openProjectModal(editIndex = null) {
    toggleModal("projectModal", true);
    await fetchProjectUsersFromAPI();

    const isEdit = editIndex !== null;
    const title = isEdit ? "Edit Project" : "Add New Project";

    const titleElement = document.getElementById("projectModalTitle");
    const saveBtn = document.getElementById("saveProjectBtn");
    const updateBtn = document.getElementById("updateProjectBtn");
    const editIndexInput = document.getElementById("editProjectIndex");

    if (titleElement) titleElement.textContent = title;
    if (saveBtn) saveBtn.classList.toggle("hidden", isEdit);
    if (updateBtn) updateBtn.classList.toggle("hidden", !isEdit);
    if (editIndexInput) editIndexInput.value = isEdit ? editIndex : "";

    if (isEdit) {
        const p = projects[editIndex];
        document.getElementById("projectName").value = p.name;
        document.getElementById("projectDueDate").value = p.due;
        document.getElementById("projectTeam").value = p.team;

        if (p.managerEmail && projectUsersDict[p.managerEmail]) {
            document.getElementById("projectManager").value = p.managerEmail;
        } else {
            const managerEntry = Object.entries(projectUsersDict).find(([email, username]) => username === p.manager);
            if (managerEntry) {
                document.getElementById("projectManager").value = managerEntry[0];
            }
        }

        assigned.project = [...p.memberEmails || p.members || []];
        components = [...p.components];

        renderComponents();
        updateAssigned("project");
    } else {
        document.getElementById("projectName").value = "";
        document.getElementById("projectDueDate").value = "";
        document.getElementById("projectTeam").value = "";
        document.getElementById("projectManager").value = "";
        assigned.project = [];
        components = [];
        renderComponents();
        updateAssigned("project");
    }
}

function closeProjectModal() {
    toggleModal("projectModal", false);
}

// ====== Task Modals ======
async function openTaskModal(editIndex = null) {
    toggleModal("taskModal", true);
    await fetchTaskUsersFromAPI();

    const isEdit = editIndex !== null;
    const title = isEdit ? "Edit Task" : "Assign Task";

    const titleElement = document.getElementById("taskModalTitle");
    const saveBtn = document.getElementById("saveTaskBtn");
    const updateBtn = document.getElementById("updateTaskBtn");
    const editIndexInput = document.getElementById("editTaskIndex");

    if (titleElement) titleElement.textContent = title;
    if (saveBtn) saveBtn.classList.toggle("hidden", isEdit);
    if (updateBtn) updateBtn.classList.toggle("hidden", !isEdit);
    if (editIndexInput) editIndexInput.value = isEdit ? editIndex : "";

    if (isEdit) {
        const t = tasks[editIndex];
        document.getElementById("taskName").value = t.name;
        document.getElementById("taskDescription").value = t.desc;
        document.getElementById("taskDueDate").value = t.due;

        assigned.task = [...t.memberEmails || t.members || []];
        updateAssigned("task");
    } else {
        document.getElementById("taskName").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskDueDate").value = "";
        assigned.task = [];
        updateAssigned("task");
    }
}

function closeTaskModal() {
    toggleModal("taskModal", false);
}

// ====== Component Modals ======
function openComponentModal() {
    toggleModal("componentModal", true);
}

function closeComponentModal() {
    toggleModal("componentModal", false);
}

// ====== Assigned Members ======
function updateAssigned(type) {
    const select = document.getElementById(`${type}Members`);
    if (!select) return;

    assigned[type] = [...select.selectedOptions].map(opt => opt.value);

    const display = document.getElementById(`${type}AssignedDisplay`);
    if (!display) return;

    display.innerHTML = "";

    assigned[type].forEach(email => {
        const username = type === 'project' ? projectUsersDict[email] : taskUsersDict[email];
        const span = document.createElement("span");
        span.className = "bg-white/10 px-2 py-1 rounded text-sm";
        span.textContent = username || email;
        display.appendChild(span);
    });
}

// ====== Components ======
function addComponent() {
    const nameInput = document.getElementById("componentName");
    const featureInput = document.getElementById("featureName");

    if (!nameInput || !featureInput) return;

    const name = nameInput.value.trim();
    const feature = featureInput.value.trim();

    if (!name || !feature) return;

    components.push({ name, feature });
    renderComponents();
    closeComponentModal();

    nameInput.value = "";
    featureInput.value = "";
}

function renderComponents() {
    const list = document.getElementById("componentsList");
    if (!list) return;

    list.innerHTML = "";

    components.forEach(c => {
        const div = document.createElement("div");
        div.className = "border border-zinc-200/80 p-2 rounded";
        div.innerHTML = `
            <div class="flex justify-between">
                <span class="font-semibold text-zinc-800">${c.name}</span>
                <button onclick="this.parentElement.nextElementSibling.classList.toggle('hidden')" class="text-secondary">▼</button>
            </div>
            <div class="hidden mt-2 text-sm text-zinc-500">${c.feature}</div>
        `;
        list.appendChild(div);
    });
}

// ====== API: Add Project ======
async function addProject() {
    const name = document.getElementById("projectName").value;
    const due = document.getElementById("projectDueDate").value;
    const team = document.getElementById("projectTeam").value;
    const managerEmail = document.getElementById("projectManager").value;
    const managerUsername = projectUsersDict[managerEmail];

    if (!name || !due || !team || !managerEmail) {
        alert("Please fill all fields!");
        return;
    }

    const compDict = Object.fromEntries(components.map(c => [c.name, c.feature]));

    const assignedMembersFormatted = assigned.project.map(email => [
        email,
        projectUsersDict[email]
    ]);

    const projectManagerFormatted = [
        [managerEmail, managerUsername]
    ];

    const payload = {
        project_name: name,
        due_date: due,
        team,
        assigned_members: assignedMembersFormatted,
        project_manager: projectManagerFormatted,
        components: compDict
    };

    try {
        const res = await fetch("/admin/dashboard/add-project", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Project added successfully!");
            projects.push({
                name,
                due,
                team,
                manager: managerUsername,
                managerEmail: managerEmail,
                memberEmails: [...assigned.project],
                members: assigned.project.map(email => projectUsersDict[email]),
                components: [...components],
                initiatedDate: getCurrentDateFormatted(),
                status: 'ongoing'
            });
            assigned.project = [];
            components = [];
            closeProjectModal();
        } else {
            alert("Error adding project!");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to connect to backend!");
    }
}

// ====== API: Add Task ======
async function addTask() {
    const name = document.getElementById("taskName").value;
    const desc = document.getElementById("taskDescription").value;
    const due = document.getElementById("taskDueDate").value;

    if (!name || !desc || !due) {
        alert("Fill all task fields!");
        return;
    }

    const assignedMembersFormatted = assigned.task.map(email => [
        email,
        taskUsersDict[email]
    ]);

    const payload = {
        task_name: name,
        desc,
        due_date: due,
        assigned_members: assignedMembersFormatted
    };

    try {
        const res = await fetch("/admin/dashboard/add-task", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert("Task added successfully!");
            tasks.push({
                name,
                desc,
                due,
                memberEmails: [...assigned.task],
                members: assigned.task.map(email => taskUsersDict[email]),
                initiatedDate: getCurrentDateFormatted(),
                status: 'ongoing'
            });
            assigned.task = [];
            closeTaskModal();
        } else {
            alert("Error adding task!");
        }
    } catch (err) {
        console.error(err);
        alert("Failed to connect to backend!");
    }
}

// ====== Update Project/Task ======
function updateProject() {
    const idx = +document.getElementById("editProjectIndex").value;
    const managerEmail = document.getElementById("projectManager").value;
    const managerUsername = projectUsersDict[managerEmail];

    projects[idx] = {
        name: document.getElementById("projectName").value,
        due: document.getElementById("projectDueDate").value,
        team: document.getElementById("projectTeam").value,
        manager: managerUsername,
        managerEmail: managerEmail,
        memberEmails: [...assigned.project],
        members: assigned.project.map(email => projectUsersDict[email]),
        components: [...components],
        initiatedDate: getCurrentDateFormatted(),
        status: 'ongoing'
    };

    closeProjectModal();
}

function updateTask() {
    const idx = +document.getElementById("editTaskIndex").value;

    tasks[idx] = {
        name: document.getElementById("taskName").value,
        desc: document.getElementById("taskDescription").value,
        due: document.getElementById("taskDueDate").value,
        memberEmails: [...assigned.task],
        members: assigned.task.map(email => taskUsersDict[email])
    };

    closeTaskModal();
}

// ====== Community Chat Functions ======
async function loadCommunityChat() {
    const chatArea = document.getElementById('chatArea');
    const loadingSpinner = document.getElementById('communityLoading');

    if (!chatArea || !loadingSpinner) return;

    // Show loading spinner
    chatArea.innerHTML = '';
    loadingSpinner.classList.remove('hidden');

    try {
        // Use the unified endpoint
        const response = await fetch('/websocket/community', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ x: 'any string value' })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const chats = await response.json();
        // console.log('Received unified community chats:', chats);

        // Hide loading spinner
        loadingSpinner.classList.add('hidden');

        // Render chats
        if (chats && chats.length > 0) {
            renderChatMessages(chats);
        } else {
            chatArea.innerHTML = `
                <div class="chat-empty">
                    <i class="fas fa-comments"></i>
                    <p>No messages yet. Start the conversation!</p>
                </div>
            `;
        }

    } catch (error) {
        console.error('Error loading community chat:', error);
        loadingSpinner.classList.add('hidden');
        chatArea.innerHTML = `
            <div class="chat-empty">
                <i class="fas fa-exclamation-triangle"></i>
                <p>Error loading messages. Please try again.</p>
            </div>
        `;
    }
}

// Render chat messages
function renderChatMessages(chats) {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;

    chatArea.innerHTML = chats.map(chat => {
        const isOwnMessage = chat.user === currentAdminId;
        const messageClass = isOwnMessage ? 'own-message' : 'other-message';

        let actualMessage = chat.message;
        let repliedData = chat.replied;

        let replyHtml = '';
        if (repliedData && repliedData.message_id) {
            let words = repliedData.message.split(/\\s+/);
            let truncText = words.length > 10 ? words.slice(0, 10).join(' ') + '....' : repliedData.message;
            replyHtml = `
                <div class="attached-reply" onclick="scrollToMessageHighlight('${repliedData.message_id}')">
                    <div class="attached-reply-header">${repliedData.username}</div>
                    <div class="attached-reply-text">${truncText}</div>
                </div>
            `;
        }

        const isDeleted = chat.is_deleted === 'DFE';
        const displayMessage = isDeleted
            ? `<em style="color:#ef4444; font-style:italic; font-weight: 500;">${chat.del_message || 'This message was deleted'}</em>`
            : actualMessage;

        // Build reaction summary bar from persisted data
        const reactionBarHtml = _buildReactionBarHtml(chat.message_id, chat.react_count || {}, chat.reactions || {});

        return `
            <div class="message-container ${messageClass}">
                <div class="message-bubble" id="${chat.message_id}">
                    ${isDeleted ? '' : `
                    <div class="message-menu-dots"><i class="fas fa-ellipsis-h"></i></div>
                    <div class="message-menu-dropdown">
                        <div class="menu-item" onclick="triggerReply('${chat.message_id}', '${(chat.username || 'Unknown User').replace(/'/g, "\\'")}', '${actualMessage.replace(/'/g, "\\'")}')"><i class="fas fa-reply"></i> Reply</div>
                        <div class="menu-item" onclick="navigator.clipboard.writeText('${actualMessage.replace(/'/g, "\\'")}'); showToast('Message copied to clipboard', 'success');"><i class="fas fa-copy"></i> Copy Message</div>
                        <div class="menu-item" onclick="window.triggerEmojiPicker(event, '${chat.message_id}')"><i class="fas fa-smile"></i> Add Reactions</div>
                        <div class="menu-item text-red-500 hover:bg-red-500/20 hover:text-red-400" onclick="window.triggerDeleteMessage(event, '${chat.message_id}')"><i class="fas fa-trash"></i> Delete</div>
                    </div>`}
                    <div class="message-header">${chat.username || 'Unknown User'}</div>
                    ${replyHtml}
                    <div class="message-content">${displayMessage}</div>
                    <div class="message-time">${chat.time}</div>
                </div>
                ${reactionBarHtml}
            </div>
        `;
    }).join('');

    // Scroll to bottom
    scrollToBottom();
}

// Format time for display
function formatTime(timeString) {
    if (!timeString) return '';

    try {
        const date = new Date(timeString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return timeString;
    }
}

// Scroll chat to bottom
function scrollToBottom() {
    const chatArea = document.getElementById('chatArea');
    if (chatArea) {
        chatArea.scrollTop = chatArea.scrollHeight;
    }
}

// Highlight message
function scrollToMessageHighlight(msgId) {
    const el = document.getElementById(msgId);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('highlight-reply');
        setTimeout(() => {
            el.classList.remove('highlight-reply');
        }, 2000);
    }
}

// Update the WebSocket URL to use the unified endpoint
function initializeCommunityWebSocket() {
    if (!currentAdminId) {
        console.error('Admin ID not found for Community WebSocket connection');
        return;
    }

    try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/websocket/ws/community/${currentAdminId}`;

        communitySocket = new WebSocket(wsUrl);

        communitySocket.onopen = function (event) {
            console.log('Unified Community WebSocket connected successfully for admin');
        };

        communitySocket.onmessage = function (event) {
            const data = JSON.parse(event.data);

            if (data.type === 'chat_message') {
                handleNewChatMessage(data.message);
            } else if (data.type === 'user_joined') {
                showSystemMessage(`${data.username} joined the chat`);
            } else if (data.type === 'user_left') {
                showSystemMessage(`${data.username} left the chat`);
            } else if (data.type === 'message_deleted') {
                // Real-time DFE: update the bubble for all connected users
                const msgEl = document.getElementById(data.message_id);
                if (msgEl) {
                    const dots = msgEl.querySelector('.message-menu-dots');
                    const dropdown = msgEl.querySelector('.message-menu-dropdown');
                    if (dots) dots.style.display = 'none';
                    if (dropdown) dropdown.style.display = 'none';
                    const contentEl = msgEl.querySelector('.message-content');
                    if (contentEl) {
                        contentEl.innerHTML = `<em style="color:#ef4444; font-style:italic; font-weight: 500;">${data.del_message || 'This message was deleted'}</em>`;
                    }
                }
            } else if (data.type === 'reaction_added') {
                // Real-time reaction: update reaction bar for all connected users
                _handleReactionAdded(data.message_id, data.react_count || {}, data.reactions || {});
            }
        };

        communitySocket.onclose = function (event) {
            console.log('Community WebSocket disconnected:', event);
        };

        communitySocket.onerror = function (error) {
            console.error('Community WebSocket error:', error);
        };

    } catch (error) {
        console.error('Error initializing Community WebSocket:', error);
    }
}

// Handle new chat message from WebSocket
function handleNewChatMessage(messageData) {
    // Add the new message to the chat area
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;

    // Remove empty state if it exists
    const emptyState = chatArea.querySelector('.chat-empty');
    if (emptyState) {
        emptyState.remove();
    }

    const isOwnMessage = messageData.user === currentAdminId;
    const messageClass = isOwnMessage ? 'own-message' : 'other-message';

    let actualMessage = messageData.message;
    let repliedData = messageData.replied;

    let replyHtml = '';
    if (repliedData && repliedData.message_id) {
        let words = repliedData.message.split(/\\s+/);
        let truncText = words.length > 10 ? words.slice(0, 10).join(' ') + '....' : repliedData.message;
        replyHtml = `
            <div class="attached-reply" onclick="scrollToMessageHighlight('${repliedData.message_id}')">
                <div class="attached-reply-header">${repliedData.username}</div>
                <div class="attached-reply-text">${truncText}</div>
            </div>
        `;
    }

    const messageElement = document.createElement('div');
    messageElement.className = `message-container ${messageClass}`;
    messageElement.innerHTML = `
        <div class="message-bubble" id="${messageData.message_id}">
            <div class="message-menu-dots"><i class="fas fa-ellipsis-h"></i></div>
            <div class="message-menu-dropdown">
                <div class="menu-item" onclick="triggerReply('${messageData.message_id}', '${(messageData.username || 'Unknown User').replace(/'/g, "\\'")}', '${actualMessage.replace(/'/g, "\\'")}')"><i class="fas fa-reply"></i> Reply</div>
                <div class="menu-item" onclick="navigator.clipboard.writeText('${actualMessage.replace(/'/g, "\\'")}'); showToast('Message copied to clipboard', 'success');"><i class="fas fa-copy"></i> Copy Message</div>
                <div class="menu-item" onclick="window.triggerEmojiPicker(event, '${messageData.message_id}')"><i class="fas fa-smile"></i> Add Reactions</div>
                <div class="menu-item text-red-500 hover:bg-red-500/20 hover:text-red-400" onclick="window.triggerDeleteMessage(event, '${messageData.message_id}')"><i class="fas fa-trash"></i> Delete</div>
            </div>
            <div class="message-header">${messageData.username || 'Unknown User'}</div>
            ${replyHtml}
            <div class="message-content">${actualMessage}</div>
            <div class="message-time">${messageData.time}</div>
        </div>
    `;

    chatArea.appendChild(messageElement);
    scrollToBottom();
}

function showSystemMessage(message) {
    const chatArea = document.getElementById('chatArea');
    if (!chatArea) return;

    // Remove empty state if it exists
    const emptyState = chatArea.querySelector('.chat-empty');
    if (emptyState) {
        emptyState.remove();
    }

    const systemElement = document.createElement('div');
    systemElement.style.display = 'flex';
    systemElement.style.justifyContent = 'center';
    systemElement.style.width = '100%';
    systemElement.style.margin = '12px 0';

    let tagStyle = 'background-color: rgba(17, 17, 17, 0.03); color: #71717a; border: 1.5px solid rgba(17, 17, 17, 0.08);';
    if (message.includes('joined')) {
        tagStyle = 'background-color: #d1fae5; color: #065f46; border: 1.5px solid rgba(6, 95, 70, 0.15);';
    } else if (message.includes('left')) {
        tagStyle = 'background-color: #fee2e2; color: #991b1b; border: 1.5px solid rgba(153, 27, 27, 0.15);';
    }

    systemElement.innerHTML = `
        <div style="${tagStyle} padding: 5px 14px; border-radius: 4px; font-size: 0.8rem; font-weight: 500; text-align: center; box-shadow: 0 2px 6px rgba(17,17,17,0.02);">
            ${message}
        </div>
    `;

    chatArea.appendChild(systemElement);
    scrollToBottom();
}

// Update sendMessage function for admin
async function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;

    const message = messageInput.value.trim();
    if (!message) return;

    let payload = {
        type: 'chat_message',
        message: message,
        user_id: currentAdminId,
        username: "Admin", // Admin identifier
        user_type: "admin",
        replied: window.currentReply ? window.currentReply : false
    };

    if (communitySocket && communitySocket.readyState === WebSocket.OPEN) {
        // Send via WebSocket with admin info
        communitySocket.send(JSON.stringify(payload));

        // Clear input
        messageInput.value = '';
        if (window.cancelReply) window.cancelReply();
    } else {
        // Fallback: Send via HTTP POST with admin info
        try {
            const response = await fetch('/websocket/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                messageInput.value = '';
                if (window.cancelReply) window.cancelReply();
            } else {
                alert('Error sending message. Please try again.');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            alert('Error sending message. Please try again.');
        }
    }
}

// Close community WebSocket when leaving the section
function closeCommunityWebSocket() {
    if (communitySocket) {
        communitySocket.close();
        communitySocket = null;
    }
}

// Refresh community button
function refreshCommunity() {
    loadCommunityChat();
}

// ====== Initialize Event Listeners ======
function initializeEventListeners() {
    // Tab navigation
    const dashboardBtn = document.getElementById('dashboardBtn');
    if (dashboardBtn) {
        dashboardBtn.addEventListener('click', function () {
            showSection('dashboardSection');
        });
    }

    const approveSignUpsBtn = document.getElementById('approveSignUpsBtn');
    if (approveSignUpsBtn) {
        approveSignUpsBtn.addEventListener('click', function () {
            showSection('signUpRequestsSection');
            fetchSignUpRequestsFromAPI();
        });
    }

    const showProjectStatusBtn = document.getElementById('showProjectStatusBtn');
    if (showProjectStatusBtn) {
        showProjectStatusBtn.addEventListener('click', function () {
            showSection('projectStatusSection');
            fetchProjectStatusFromAPI();
        });
    }

    const showTaskStatusBtn = document.getElementById('showTaskStatusBtn');
    if (showTaskStatusBtn) {
        showTaskStatusBtn.addEventListener('click', function () {
            showSection('taskStatusSection');
            fetchTaskStatusFromAPI();
        });
    }

    const membersProfileBtn = document.getElementById('membersProfileBtn');
    if (membersProfileBtn) {
        membersProfileBtn.addEventListener('click', function () {
            showSection('membersProfileSection');
            fetchMembersFromAPI();
        });
    }

    const communityBtn = document.getElementById('communityBtn');
    if (communityBtn) {
        communityBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showSection('communitySection');
            loadCommunityChat();
            initializeCommunityWebSocket();
        });
    }

    // Notification button
    const notificationBtn = document.getElementById('notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function () {
            openNotificationModal();
        });
    }

    // Project filter buttons
    const allProjectsBtn = document.getElementById('allProjectsBtn');
    if (allProjectsBtn) {
        allProjectsBtn.addEventListener('click', function () {
            setActiveProjectFilter('all');
            renderProjectStatus();
        });
    }

    const ongoingProjectsBtn = document.getElementById('ongoingProjectsBtn');
    if (ongoingProjectsBtn) {
        ongoingProjectsBtn.addEventListener('click', function () {
            setActiveProjectFilter('ongoing');
            renderProjectStatus();
        });
    }

    const completedProjectsBtn = document.getElementById('completedProjectsBtn');
    if (completedProjectsBtn) {
        completedProjectsBtn.addEventListener('click', function () {
            setActiveProjectFilter('completed');
            renderProjectStatus();
        });
    }

    // Task filter buttons
    const allTasksBtn = document.getElementById('allTasksBtn');
    if (allTasksBtn) {
        allTasksBtn.addEventListener('click', function () {
            setActiveTaskFilter('all');
            renderTaskStatus();
        });
    }

    const ongoingTasksBtn = document.getElementById('ongoingTasksBtn');
    if (ongoingTasksBtn) {
        ongoingTasksBtn.addEventListener('click', function () {
            setActiveTaskFilter('ongoing');
            renderTaskStatus();
        });
    }

    const completedTasksBtn = document.getElementById('completedTasksBtn');
    if (completedTasksBtn) {
        completedTasksBtn.addEventListener('click', function () {
            setActiveTaskFilter('completed');
            renderTaskStatus();
        });
    }

    // Member filter buttons
    const allMembersBtn = document.getElementById('allMembersBtn');
    if (allMembersBtn) {
        allMembersBtn.addEventListener('click', function () {
            setActiveMemberFilter('all');
            renderMembers();
        });
    }

    const devTeamBtn = document.getElementById('devTeamBtn');
    if (devTeamBtn) {
        devTeamBtn.addEventListener('click', function () {
            setActiveMemberFilter('Dev Team');
            renderMembers();
        });
    }

    const designTeamBtn = document.getElementById('designTeamBtn');
    if (designTeamBtn) {
        designTeamBtn.addEventListener('click', function () {
            setActiveMemberFilter('Design Team');
            renderMembers();
        });
    }

    const marketingTeamBtn = document.getElementById('marketingTeamBtn');
    if (marketingTeamBtn) {
        marketingTeamBtn.addEventListener('click', function () {
            setActiveMemberFilter('Marketing Team');
            renderMembers();
        });
    }

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function () {
            const sidebar = document.querySelector('.sidebar');
            const mainContent = document.querySelector('.main-content');

            if (sidebar && mainContent) {
                sidebar.classList.toggle('collapsed');
                mainContent.classList.toggle('expanded');
            }
        });
    }

    // Delete confirmation modal buttons
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', closeDeleteConfirmation);
    }

    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', confirmDelete);
    }

    // Community buttons
    const refreshCommunityBtn = document.getElementById('refreshCommunity');
    if (refreshCommunityBtn) {
        refreshCommunityBtn.addEventListener('click', function (e) {
            e.preventDefault();
            loadCommunityChat();
        });
    }

    const sendMessageBtn = document.getElementById('sendMessageBtn');
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendMessage);
    }

    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Scroll dynamic hide/show for typing area
    const chatArea = document.getElementById('chatArea');
    if (chatArea) {
        let lastScrollTop = 0;
        chatArea.addEventListener('scroll', function () {
            const inputContainer = document.getElementById('messageInputContainer');
            const replyPreview = document.getElementById('replyPreviewContainer');
            if (!inputContainer) return;

            let scrollTop = chatArea.scrollTop;

            // Show typing area when scrolled close to the bottom
            if (scrollTop + chatArea.clientHeight >= chatArea.scrollHeight - 15) {
                inputContainer.classList.remove('typing-area-hidden');
                if (replyPreview) replyPreview.classList.remove('typing-area-hidden');
                lastScrollTop = scrollTop;
                return;
            }

            // Scroll change threshold to prevent jitter
            if (Math.abs(scrollTop - lastScrollTop) <= 5) return;

            if (scrollTop > lastScrollTop) {
                // Scrolling down -> Show typing area
                inputContainer.classList.remove('typing-area-hidden');
                if (replyPreview) replyPreview.classList.remove('typing-area-hidden');
            } else {
                // Scrolling up -> Hide typing area
                inputContainer.classList.add('typing-area-hidden');
                if (replyPreview) replyPreview.classList.add('typing-area-hidden');
            }
            lastScrollTop = scrollTop;
        });
    }

    // Context Menu (Right Click) on Chat Bubbles
    document.addEventListener('contextmenu', function (e) {
        const bubble = e.target.closest('.message-bubble');
        if (bubble) {
            const dropdown = bubble.querySelector('.message-menu-dropdown');
            if (dropdown) {
                e.preventDefault();

                // Close other dropdowns
                document.querySelectorAll('.message-menu-dropdown').forEach(d => {
                    if (d !== dropdown) d.classList.remove('active-dropdown');
                });

                // Toggle active state
                dropdown.classList.toggle('active-dropdown');

                // Position boundary checks
                const chatArea = bubble.closest('.chat-area');
                const containerBottom = chatArea ? chatArea.getBoundingClientRect().bottom : window.innerHeight;
                if (e.clientY + 150 > containerBottom) {
                    dropdown.classList.add('show-upwards');
                } else {
                    dropdown.classList.remove('show-upwards');
                }
            }
        }
    });

    // Close dropdown on click outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('.message-menu-dots') && !e.target.closest('.message-menu-dropdown')) {
            document.querySelectorAll('.message-menu-dropdown').forEach(d => {
                d.classList.remove('active-dropdown');
            });
        }
    });

    // Modal close buttons
    const closeButtons = document.querySelectorAll('.modal-close, .cancel-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            const modal = this.closest('.modal');
            if (modal) {
                modal.classList.remove('flex');
                modal.classList.add('hidden');
            }
        });
    });

    // Save/Add buttons
    const saveProjectBtn = document.getElementById('saveProjectBtn');
    if (saveProjectBtn) {
        saveProjectBtn.addEventListener('click', addProject);
    }

    const saveTaskBtn = document.getElementById('saveTaskBtn');
    if (saveTaskBtn) {
        saveTaskBtn.addEventListener('click', addTask);
    }

    const updateProjectBtn = document.getElementById('updateProjectBtn');
    if (updateProjectBtn) {
        updateProjectBtn.addEventListener('click', updateProject);
    }

    const updateTaskBtn = document.getElementById('updateTaskBtn');
    if (updateTaskBtn) {
        updateTaskBtn.addEventListener('click', updateTask);
    }

    const addComponentBtn = document.getElementById('addComponentBtn');
    if (addComponentBtn) {
        addComponentBtn.addEventListener('click', addComponent);
    }

    // Project and Task member selection
    const projectMembersSelect = document.getElementById('projectMembers');
    if (projectMembersSelect) {
        projectMembersSelect.addEventListener('change', function () {
            updateAssigned('project');
        });
    }

    const taskMembersSelect = document.getElementById('taskMembers');
    if (taskMembersSelect) {
        taskMembersSelect.addEventListener('change', function () {
            updateAssigned('task');
        });
    }
}

// ====== Initialize Application ======
document.addEventListener('DOMContentLoaded', function () {
    // Initialize filter variables
    window.projectFilter = 'all';
    window.taskFilter = 'all';
    window.memberFilter = 'all';

    // Set initial active filters
    setActiveProjectFilter('all');
    setActiveTaskFilter('all');
    setActiveMemberFilter('all');

    // Initialize event listeners
    initializeEventListeners();

    // Initialize dashboard with template data
    initializeDashboard();

    // Initialize WebSocket connection
    initializeWebSocket();

    // Show dashboard by default
    showSection('dashboardSection');
});

// Make functions available globally
window.initializeWebSocket = initializeWebSocket;
window.updateConnectionStatus = updateConnectionStatus;
window.handleNewNotification = handleNewNotification;
window.playNotificationSound = playNotificationSound;
window.showToast = showToast;
window.updateNotificationBadge = updateNotificationBadge;
window.showDeleteConfirmation = showDeleteConfirmation;
window.closeDeleteConfirmation = closeDeleteConfirmation;
window.confirmDelete = confirmDelete;
window.fetchNotificationsFromAPI = fetchNotificationsFromAPI;
window.openNotificationModal = openNotificationModal;
window.closeNotificationModal = closeNotificationModal;
window.renderNotifications = renderNotifications;
window.fetchMembersFromAPI = fetchMembersFromAPI;
window.renderMembers = renderMembers;
window.openMemberDetailsModal = openMemberDetailsModal;
window.closeMemberDetailsModal = closeMemberDetailsModal;
window.fetchSignUpRequestsFromAPI = fetchSignUpRequestsFromAPI;
window.sendUserAction = sendUserAction;
window.approveUser = approveUser;
window.rejectUser = rejectUser;
window.fetchTaskStatusFromAPI = fetchTaskStatusFromAPI;
window.openTaskDetailsModal = openTaskDetailsModal;
window.closeTaskDetailsModal = closeTaskDetailsModal;
window.fetchProjectStatusFromAPI = fetchProjectStatusFromAPI;
window.openProjectDetailsModal = openProjectDetailsModal;
window.closeProjectDetailsModal = closeProjectDetailsModal;
window.fetchProjectUsersFromAPI = fetchProjectUsersFromAPI;
window.populateProjectUserDropdowns = populateProjectUserDropdowns;
window.fetchTaskUsersFromAPI = fetchTaskUsersFromAPI;
window.populateTaskUserDropdowns = populateTaskUserDropdowns;
window.setActiveProjectFilter = setActiveProjectFilter;
window.setActiveTaskFilter = setActiveTaskFilter;
window.setActiveMemberFilter = setActiveMemberFilter;
window.showSection = showSection;
window.renderProjectStatus = renderProjectStatus;
window.renderTaskStatus = renderTaskStatus;
window.getCurrentDateFormatted = getCurrentDateFormatted;
window.getCurrentTime = getCurrentTime;
window.toggleModal = toggleModal;
window.openProjectModal = openProjectModal;
window.closeProjectModal = closeProjectModal;
window.openTaskModal = openTaskModal;
window.closeTaskModal = closeTaskModal;
window.openComponentModal = openComponentModal;
window.closeComponentModal = closeComponentModal;
window.updateAssigned = updateAssigned;
window.addComponent = addComponent;
window.renderComponents = renderComponents;
window.addProject = addProject;
window.addTask = addTask;
window.updateProject = updateProject;
window.updateTask = updateTask;
window.loadCommunityChat = loadCommunityChat;
window.initializeCommunityWebSocket = initializeCommunityWebSocket;
window.sendMessage = sendMessage;
window.refreshCommunity = refreshCommunity;
window.closeCommunityWebSocket = closeCommunityWebSocket;

// ====== Reply State Management ======
window.currentReply = null;

window.triggerReply = function (messageId, username, messageText) {
    window.currentReply = {
        message_id: messageId,
        username: username,
        message: messageText
    };

    let words = messageText.split(/\\s+/);
    let previewText = words.length > 10 ? words.slice(0, 10).join(' ') + '....' : messageText;

    const replyContainer = document.getElementById('replyPreviewContainer');
    const replyName = document.getElementById('replyPreviewName');
    const replyText = document.getElementById('replyPreviewText');

    if (replyContainer && replyName && replyText) {
        replyName.textContent = username;
        replyText.textContent = previewText;
        replyContainer.style.display = 'flex';

        const input = document.getElementById('messageInput');
        if (input) input.focus();
    }
};

window.cancelReply = function () {
    window.currentReply = null;
    const replyContainer = document.getElementById('replyPreviewContainer');
    if (replyContainer) {
        replyContainer.style.display = 'none';
    }
};

// Listen for reply cancel
document.addEventListener('DOMContentLoaded', () => {
    const closeReplyBtn = document.getElementById('closeReplyBtn');
    if (closeReplyBtn) {
        closeReplyBtn.addEventListener('click', window.cancelReply);
    }
});

// ====== Message Dropdown Position Logic ======
document.addEventListener('mouseover', function (e) {
    const dots = e.target.closest('.message-menu-dots');
    if (dots) {
        const dropdown = dots.nextElementSibling;
        if (dropdown && dropdown.classList.contains('message-menu-dropdown')) {
            const rect = dots.getBoundingClientRect();
            // Get the chat container to check boundaries
            const chatArea = dots.closest('.chat-area');
            const containerBottom = chatArea ? chatArea.getBoundingClientRect().bottom : window.innerHeight;

            // Estimate dropdown height as ~150px
            if (rect.bottom + 150 > containerBottom) {
                dropdown.classList.add('show-upwards');
            } else {
                dropdown.classList.remove('show-upwards');
            }
        }
    }
});

// ====== Message Delete Logic ======
let messageToDelete = null;

window.triggerDeleteMessage = function (event, msgId) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    messageToDelete = msgId;
    const overlay = document.getElementById('messageDeleteOverlay');
    const modal = document.getElementById('messageDeleteModal');
    if (overlay) overlay.style.display = 'block';
    if (modal) modal.style.display = 'block';
};

window.closeMessageDeleteModal = function () {
    messageToDelete = null;
    const overlay = document.getElementById('messageDeleteOverlay');
    const modal = document.getElementById('messageDeleteModal');
    if (overlay) overlay.style.display = 'none';
    if (modal) modal.style.display = 'none';
};

window.deleteMessageForMe = async function () {
    const msgId = messageToDelete;
    window.closeMessageDeleteModal();

    if (!msgId) return;

    try {
        const response = await fetch('/websocket/delete-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message_id: msgId, deletion_type: 'DFM' })
        });

        const data = await response.json();

        // Show server message as toast
        if (data.success) {
            showToast(data.message || 'Message deleted.', 'success');
            // Remove the message bubble from UI
            const msgEl = document.getElementById(msgId);
            if (msgEl) {
                const container = msgEl.closest('.message-container');
                if (container) container.remove();
                else msgEl.remove();
            }
        } else {
            showToast(data.message || data.error || 'Could not delete message.', 'error');
        }
    } catch (err) {
        console.error('Delete for me error:', err);
        showToast('Error deleting message. Please try again.', 'error');
    }
};

window.deleteMessageForEveryone = async function () {
    const msgId = messageToDelete;
    window.closeMessageDeleteModal();

    if (!msgId) return;

    try {
        const response = await fetch('/websocket/delete-message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message_id: msgId, deletion_type: 'DFE' })
        });

        const data = await response.json();

        if (data.success) {
            showToast(data.message || 'Message deleted for everyone.', 'success');
            // Replace message bubble content with deleted placeholder
            const msgEl = document.getElementById(msgId);
            if (msgEl) {
                const dots = msgEl.querySelector('.message-menu-dots');
                const dropdown = msgEl.querySelector('.message-menu-dropdown');
                if (dots) dots.style.display = 'none';
                if (dropdown) dropdown.style.display = 'none';
                const contentEl = msgEl.querySelector('.message-content');
                if (contentEl) {
                    contentEl.innerHTML = '<em style="color:rgba(255,255,255,0.45); font-style:italic;">This message was deleted</em>';
                }
            }
        } else {
            showToast(data.message || data.error || 'Could not delete message.', 'error');
        }
    } catch (err) {
        console.error('Delete for everyone error:', err);
        showToast('Error deleting message. Please try again.', 'error');
    }
};

// ====== Reaction helpers ======

function _buildReactionBarHtml(msgId, reactCount, reactions) {
    if (!reactCount || !Object.keys(reactCount).length) return '';

    const emojis = Object.entries(reactCount)
        .map(([icon, count]) => `<span class="reaction-chip">${icon}<span class="reaction-count">${count}</span></span>`)
        .join('');

    return `<div class="reaction-bar">
        <div class="reaction-summary"
             data-counts='${JSON.stringify(reactCount).replace(/'/g, "&#39;")}'
             data-reactions='${JSON.stringify(reactions).replace(/'/g, "&#39;")}'
             onclick="window._showReactionTooltip(event, this)">
            ${emojis}
        </div>
    </div>`;
}

function _renderSummaryPill(el, counts, reactions) {
    const emojis = Object.entries(counts)
        .map(([icon, count]) => `<span class="reaction-chip">${icon}<span class="reaction-count">${count}</span></span>`)
        .join('');
    el.innerHTML = emojis;
    el.onclick = (e) => window._showReactionTooltip(e, el);
    el.classList.add('reaction-bump');
    setTimeout(() => el.classList.remove('reaction-bump'), 300);
}

window._showReactionTooltip = function (event, summaryEl) {
    event.stopPropagation();
    document.querySelectorAll('.reaction-tooltip').forEach(t => t.remove());

    let reactions = {};
    try { reactions = JSON.parse(summaryEl.dataset.reactions || '{}'); } catch (e) { }

    if (!Object.keys(reactions).length) return;

    const tooltip = document.createElement('div');
    tooltip.className = 'reaction-tooltip';

    const rows = Object.values(reactions).map(r =>
        `<div class="reaction-tooltip-row"><span class="rt-emoji">${r.reaction}</span><span class="rt-name">${r.username}</span></div>`
    ).join('');

    tooltip.innerHTML = `<div class="reaction-tooltip-title">Reactions</div>${rows}`;
    document.body.appendChild(tooltip);

    const rect = summaryEl.getBoundingClientRect();
    let top = rect.top - tooltip.offsetHeight - 8;
    let left = rect.left;
    if (top < 8) top = rect.bottom + 8;
    if (left + 200 > window.innerWidth) left = window.innerWidth - 208;
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';

    setTimeout(() => {
        document.addEventListener('click', () => tooltip.remove(), { once: true });
    }, 0);
};

/**
 * Upsert the reaction pill below a message bubble from server-authoritative data.
 * Called by both the REST response handler and the WS reaction_added event.
 */
function _handleReactionAdded(msgId, counts, reactions) {
    const bubble = document.getElementById(msgId);
    if (!bubble) return;

    const container = bubble.closest('.message-container') || bubble.parentElement;
    let bar = container.querySelector('.reaction-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.className = 'reaction-bar';
        bubble.insertAdjacentElement('afterend', bar);
    }

    let summaryEl = bar.querySelector('.reaction-summary');
    if (!summaryEl) {
        summaryEl = document.createElement('div');
        summaryEl.className = 'reaction-summary';
        bar.appendChild(summaryEl);
    }

    summaryEl.dataset.counts = JSON.stringify(counts);
    summaryEl.dataset.reactions = JSON.stringify(reactions);
    _renderSummaryPill(summaryEl, counts, reactions);
}

// ====== Emoji Picker (emoji-mart v5) ======
let _emojiPicker = null;
let _emojiTargetMsgId = null;

function _getOrCreateEmojiPicker() {
    if (_emojiPicker) return _emojiPicker;
    const wrapper = document.getElementById('emojiPickerWrapper');
    if (!wrapper || typeof EmojiMart === 'undefined') return null;

    _emojiPicker = new EmojiMart.Picker({
        onEmojiSelect: (emoji) => {
            if (_emojiTargetMsgId) {
                _addReactionToMessage(_emojiTargetMsgId, emoji.native);
            }
            _closeEmojiPicker();
        },
        theme: 'dark',
        previewPosition: 'none',
        skinTonePosition: 'none',
    });
    wrapper.appendChild(_emojiPicker);
    return _emojiPicker;
}

function _closeEmojiPicker() {
    const wrapper = document.getElementById('emojiPickerWrapper');
    if (wrapper) wrapper.style.display = 'none';
    _emojiTargetMsgId = null;
}

window.triggerEmojiPicker = function (event, msgId) {
    event.preventDefault();
    event.stopPropagation();

    const wrapper = document.getElementById('emojiPickerWrapper');
    if (!wrapper) return;

    // If same msg and already open, close it
    if (wrapper.style.display !== 'none' && _emojiTargetMsgId === msgId) {
        _closeEmojiPicker();
        return;
    }

    _emojiTargetMsgId = msgId;
    _getOrCreateEmojiPicker();

    // Position near the clicked button
    const rect = event.currentTarget.getBoundingClientRect();
    const pickerWidth = 352;
    const pickerHeight = 435;
    let left = rect.right + 8;
    let top = rect.top;

    // Prevent overflow off screen
    if (left + pickerWidth > window.innerWidth) left = rect.left - pickerWidth - 8;
    if (top + pickerHeight > window.innerHeight) top = window.innerHeight - pickerHeight - 8;
    if (top < 8) top = 8;

    wrapper.style.left = left + 'px';
    wrapper.style.top = top + 'px';
    wrapper.style.display = 'block';
};

async function _addReactionToMessage(msgId, emoji) {
    let data;
    try {
        const res = await fetch('/websocket/add-reaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message_id: msgId, reaction: emoji })
        });
        data = await res.json();
        if (!data.success) {
            showToast(data.message || 'Could not add reaction.', 'error');
            return;
        }
    } catch (err) {
        console.error('Add reaction error:', err);
        showToast('Error adding reaction.', 'error');
        return;
    }
    // DOM update is handled by the WS broadcast (reaction_added event)
    // but also update immediately for the sender in case WS is slow
    _handleReactionAdded(msgId, data.react_count || {}, data.reactions || {});
}

// Close emoji picker when clicking outside
document.addEventListener('click', function (e) {
    const wrapper = document.getElementById('emojiPickerWrapper');
    if (wrapper && wrapper.style.display !== 'none') {
        if (!wrapper.contains(e.target) && !e.target.closest('.menu-item')) {
            _closeEmojiPicker();
        }
    }
});