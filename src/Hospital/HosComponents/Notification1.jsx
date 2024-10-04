// import React, { useState, useEffect, useRef } from 'react';
// import PropTypes from 'prop-types';

// const Notification1 = ({ hospitalId }) => {
//     const [notifications, setNotifications] = useState([]);
//     const socketRef = useRef(null);
//     const [isConnected, setIsConnected] = useState(false);
//     const reconnectTimeout = useRef(null);

//     const connectWebSocket = () => {
//         if (!hospitalId) {
//             console.error('No hospitalId provided for WebSocket connection');
//             return;
//         }

//         // Initialize WebSocket connection
//         socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${hospitalId}/`);

//         socketRef.current.onopen = () => {
//             setIsConnected(true);
//             console.log('WebSocket connected');
//         };

//         socketRef.current.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             setNotifications((prevNotifications) => [...prevNotifications, data.message]);

//             // Alert the user with the incoming message
//             alert(data.message);  // Display the message in an alert
//         };

//         socketRef.current.onclose = (e) => {
//             console.error('WebSocket closed unexpectedly', e);
//             setIsConnected(false);
//             if (e.code === 1006) {
//                 console.error('Abnormal WebSocket closure');
//                 reconnectWebSocket();  // Attempt to reconnect
//             }
//         };

//         socketRef.current.onerror = (error) => {
//             console.error('WebSocket encountered an error:', error);
//         };
//     };

//     const reconnectWebSocket = () => {
//         if (reconnectTimeout.current) {
//             clearTimeout(reconnectTimeout.current);
//         }
//         reconnectTimeout.current = setTimeout(() => {
//             console.log('Reconnecting WebSocket...');
//             connectWebSocket();
//         }, 3000);  // Attempt to reconnect after 3 seconds
//     };

//     useEffect(() => {
//         connectWebSocket();

//         return () => {
//             if (socketRef.current) {
//                 socketRef.current.close();
//             }
//             if (reconnectTimeout.current) {
//                 clearTimeout(reconnectTimeout.current);
//             }
//         };
//     }, [hospitalId]);

//     return (
//         <div>
//             <h2>Notifications {isConnected ? "(Connected)" : "(Disconnected)"}</h2>
//             <ul>
//                 {notifications.map((notification, index) => (
//                     <li key={index}>{notification}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// Notification1.propTypes = {
//     hospitalId: PropTypes.number.isRequired,
// };

// export default Notification1;

import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const Notification1 = ({ roomName }) => {
    const [notifications, setNotifications] = useState([]);
    const socketRef = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const reconnectTimeout = useRef(null);
    

    const connectWebSocket = () => {
        if (!roomName) {
            console.error('No roomName provided for WebSocket connection');
            return;
        }

        // Initialize WebSocket connection
        socketRef.current = new WebSocket(`ws://127.0.0.1:8000/ws/notifications/${roomName}/`);


        socketRef.current.onopen = () => {
            setIsConnected(true);
            console.log('WebSocket connected');
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setNotifications((prevNotifications) => [...prevNotifications, data.message]);

            // Optionally alert the user with the incoming message
            alert(data.message);
        };

        socketRef.current.onclose = (e) => {
            console.error('WebSocket closed unexpectedly', e);
            setIsConnected(false);
            if (e.code === 1006) {
                console.error('Abnormal WebSocket closure');
                reconnectWebSocket();  // Attempt to reconnect
            }
        };

        socketRef.current.onerror = (error) => {
            console.error('WebSocket encountered an error:', error);
        };
    };

    const reconnectWebSocket = () => {
        if (reconnectTimeout.current) {
            clearTimeout(reconnectTimeout.current);
        }
        // Ensure no old WebSocket instance exists
        if (socketRef.current) {
            socketRef.current.close();
            socketRef.current = null;
        }
        reconnectTimeout.current = setTimeout(() => {
            console.log('Reconnecting WebSocket...');
            connectWebSocket();
        }, 3000);  // Reconnect after 3 seconds
    };
    
    useEffect(() => {
        connectWebSocket();

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
            if (reconnectTimeout.current) {
                clearTimeout(reconnectTimeout.current);
            }
        };
    }, [roomName]);

    return (
        <div>
            <h2>Notifications {isConnected ? "(Connected)" : "(Disconnected)"}</h2>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>{notification}</li>
                ))}
            </ul>
        </div>
    );
};

Notification1.propTypes = {
    roomName: PropTypes.string.isRequired,
};

export default Notification1;
