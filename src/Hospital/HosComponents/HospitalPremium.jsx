import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom'; 
import HospitalPanel from './HospitalPanel';

const HospitalPremium = () => {
    const [isSubscribed, setIsSubscribed] = useState(false); 
    const [loading, setLoading] = useState(true); 
    const [showModal, setShowModal] = useState(false); // State to control modal visibility
    const navigate = useNavigate(); 

    useEffect(() => {
        const hospitalId = localStorage.getItem('hospital_id'); 

        if (hospitalId) {
            axios.get(`http://localhost:8080/api/check-subscription-status/${hospitalId}`)
                .then(response => {
                    setIsSubscribed(response.data.isSubscribed); 
                })
                .catch(error => {
                    console.error("Error fetching subscription status", error);
                })
                .finally(() => {
                    setLoading(false); 
                });
        } else {
            setLoading(false);
            console.error("Hospital ID is missing");
        }
    }, []);

    const styles = {
        cardContainer: {
            maxWidth: '400px',
            margin: '20px auto',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            backgroundColor:  '#20a8a6',
            color: '#fff',
            textAlign: 'center',
        },
        price: {
            fontSize: '32px',
            fontWeight: 'bold',
            margin: '20px 0',
        },
        description: {
            margin: '10px 0',
            fontSize: '14px',
        },
        subscribeButton: {
            backgroundColor: '#20a8a6',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
            opacity: isSubscribed ? 0.5 : 1, 
            cursor: isSubscribed ? 'not-allowed' : 'pointer', 
        },
        featureContainer: {
            marginTop: '30px',
            textAlign: 'center',
        },
        featureTitle: {
            fontSize: '18px',
            marginBottom: '10px',
            fontWeight: 'bold',
        },
        featureDescription: {
            marginBottom: '20px',
            fontSize: '14px',
            textAlign: 'center',
        },
        lockIcon: {
            marginRight: '10px',
        },
        autocompleteNew: {
            color: '#f57c00',
            fontWeight: 'bold',
        }
    };

    const handlePayment = async () => {
        if (isSubscribed) return; 

        const paymentMethod = 'razorpay'; 
        const hospitalId = localStorage.getItem('hospital_id'); 
        const date = 'some_date'; 
    
        if (!hospitalId) {
            console.error("Hospital ID is missing");
            return;
        }
    
        const numericHospitalId = parseInt(hospitalId, 10);
        if (isNaN(numericHospitalId)) {
            console.error("Invalid Hospital ID");
            return;
        }
    
        try {
            if (paymentMethod === 'razorpay') {
                const response = await axios.post('http://localhost:8080/api/create-premium-order/', {
                    hospital_id: numericHospitalId, 
                    date: date,
                    payment_method: 'razorpay',
                    amount: 399900,  
                    currency: 'INR' 
                });
    
                const { data } = response;
    
                const options = {
                    key: 'rzp_test_d5VCv4MOwkIpcU',
                    amount: data.amount,
                    currency: data.currency,
                    name: "Hospital Premium",
                    description: "Premium Fee",
                    order_id: data.order_id,
                    handler: async function (response) {
                        try {
                            await axios.post('http://localhost:8080/api/razorpay-premium-success/', {
                                booking_id: data.booking_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                            });
    
                            navigate('/hospital_premium');
                        } catch (err) {
                            console.error("Error during payment success callback", err);
                        }
                    },
                    prefill: {
                        name: "SUMISHA PS",
                        email: "sumishasudha392@gmail.com",
                        contact: "9037235334",
                    },
                    theme: {
                        color: "#3399cc",
                    },
                };
    
                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (err) {
            console.error("Error during payment", err);
        } finally {
            setShowModal(false); // Close the modal after payment
        }
    };

    if (loading) {
        return <div>Loading...</div>; 
    }

    return (
        <div>
            <HospitalPanel />
          <div style={styles.cardContainer}> 
            <h2>
            {isSubscribed ? (
                    <div style={styles.description}>
                        You are already subscribed for this month.
                    </div>
                ) : (
                    <button style={styles.subscribeButton} onClick={handlePayment}>Subscribe</button>
                )}
            </h2>
          </div>
            <div style={styles.cardContainer}>
                <h3>Monthly Subscription</h3>
                <div style={styles.price}>₹3999/mo</div>
                <div style={styles.description}>Down from ₹3999/month.</div>
                <div style={styles.description}>
                    Our monthly plan grants access to all premium features, the best plan for short-term subscribers.
                </div>
                <div style={styles.description}>(prices are marked in USD)</div>

                {isSubscribed ? (
                    <div style={styles.description}>
                        You are already subscribed for this month.
                    </div>
                ) : (
                    <button style={styles.subscribeButton} onClick={handlePayment}>Subscribe</button>
                )}
            </div>

            <div style={styles.featureContainer}>
                <div style={styles.featureTitle}>
                    <span role="img" aria-label="lock" style={styles.lockIcon}>🔒</span>
                    Access to Premium Content
                </div>
                <div style={styles.featureDescription}>
                    Gain exclusive access to our latest and ever-growing collection of premium content,
                    <br />such as questions, Explore cards, and premium solutions,<br />
                    where detailed explanations are written by our team of algorithm and data structure experts.
                </div>

                <div style={styles.featureTitle}>
                    <span style={styles.autocompleteNew}>NEW</span> Autocomplete
                </div>
                <div style={styles.featureDescription}>
                    Not interested in memorization? With premium access, you receive intelligent code completion inside the editor.<br />
                    {isSubscribed ? (
                        <button style={styles.subscribeButton} disabled>Subscribe</button>
                    ) : (
                        <button style={styles.subscribeButton} onClick={handlePayment}>Subscribe</button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HospitalPremium;
