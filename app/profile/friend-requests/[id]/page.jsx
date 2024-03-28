"use client";
import { useState, useEffect } from 'react';
import FriendRequest from '@components/FriendRequest';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'; // corrected import

const FriendRequests = () => {
    const { data: session } = useSession();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [answered, setAnswered] = useState(0); // moved answered state to top-level

    useEffect(() => {
        const fetchFriendRequests = async () => {
            try {
                const res = await fetch(`/api/profile/${session?.user.id}/requests/`, {
                    method: 'GET',
                });
                if (!res.ok) {
                    throw new Error('Failed to fetch friend requests');
                }

                const data = await res.json();
                const requestsIds = data.user.friend_requests;

                // Fetch profiles of all friend requests
                const requestsData = await Promise.all(
                    requestsIds.map(async (requestId) => {
                        const profileRes = await fetch(`/api/profile/${requestId}/requests`, {
                            method: 'GET',
                        });
                        if (!profileRes.ok) {
                            throw new Error(`Failed to fetch profile for request ID ${requestId}`);
                        }
                        return profileRes.json();
                    })
                );

                setRequests(requestsData);
                setLoading(false); // Set loading to false once all requests are resolved
            } catch (error) {
                console.error('Error fetching friend requests:', error);
                setLoading(false); // Set loading to false in case of an error
            }
        };

        if (session?.user) {
            fetchFriendRequests();
        }
    }, [session]);

    const handleAccept = async (senderId) => {
        const receiverId = session?.user?.id; // Assuming session contains user information

        if (!receiverId) {
            console.error('User ID not found in session');
            return;
        }
        try {
            const response = await fetch(`/api/profile/${receiverId}/requests`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senderId: senderId
                })
            });
            // Check if the response indicates success
            if (response.status === 200) {
                setAnswered(1); // Update answered state
                // Handle success, e.g., update UI to reflect the liked status
                console.log('Friend accepted');
                // REDIRECT TO SAME PAGE

            } else {
                // Handle other status codes (e.g., 404, 500)
                console.error('Error:', response.data);
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Handle network errors or other exceptions
        }
    };

    const handleReject = async (senderId) => {
        const receiverId = session?.user?.id; // Assuming session contains user information

        if (!receiverId) {
            console.error('User ID not found in session');
            return;
        }
        try {
            const response = await fetch(`/api/profile/${receiverId}/requests`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    senderId: senderId
                })
            });
            // Check if the response indicates success
            if (response.status === 200) {
                setAnswered(2); // Update answered state
                // Handle success, e.g., update UI to reflect the liked status
                console.log('Friend rejected');
                // REDIRECT TO SAME PAGE
            } else {
                // Handle other status codes (e.g., 404, 500)
                console.error('Error:', response.data);
            }
        } catch (error) {
            console.error('Error:', error.message);
            // Handle network errors or other exceptions
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Render a loading indicator while requests are being fetched
    }

    return (
        <div>
            {requests.map((request) => (
                <FriendRequest
                    key={request.user._id}
                    userId={request.user.username}
                    handleAccept={() => handleAccept(request.user._id)}
                    handleReject={() => handleReject(request.user._id)}
                    answered={answered} // pass answered as prop to FriendRequest component
                />
            ))}
        </div>
    );
};

export default FriendRequests;
