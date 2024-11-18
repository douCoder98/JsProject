// hist.js
const userId = localStorage.getItem('userId');
let history;

$(document).ready(function() {
    // Call loadConnections when the page loads
    loadConnections();

    // Initialize any Bootstrap tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
});

function loadConnections() {
    if (!userId) {
        console.error('User ID not found in localStorage');
        return;
    }

    $.ajax({
        url: `/connection_history/${userId}`,
        method: 'GET',
        success: function(response) {
            if (response && response.data) {
                history = response.data;
                displayConnections(history);
            } else {
                console.error('Invalid response format:', response);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching connection history:', error);
            $('#connectionsTableBody').html(
                '<tr><td colspan="3" class="text-center text-danger">' +
                'Erreur lors du chargement de l\'historique des connexions</td></tr>'
            );
        }
    });
}

function displayConnections(connections) {
    const tableBody = $('#connectionsTableBody');
    tableBody.empty();

    if (connections && connections.length > 0) {
        connections.forEach(function(connection) {
            const statusClass = connection.status === 'success' ? 'text-success' : 'text-danger';
            const statusIcon = connection.status === 'success' ? 
                '<i class="fas fa-check-circle"></i>' : 
                '<i class="fas fa-times-circle"></i>';

            const row = `
                <tr>
                    <td>${connection.connection_date}</td>
                    <td>${connection.ip_address}</td>
                    <td class="${statusClass}">
                        ${statusIcon} ${connection.status}
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    } else {
        tableBody.html(
            '<tr><td colspan="3" class="text-center">' +
            'Aucun historique de connexion disponible</td></tr>'
        );
    }
}