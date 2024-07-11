"use client";

import { db } from '@/config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import PendingCard from '@/components/Cards/pendingCard';

const PendingRequests = () => {
    const [data, setData] = useState<Data[]>([]);
    const [loading, setLoading] = useState(true);

    interface Data {
        id: string;
        address: string;
        ageMonths: number;
        ageYears: number;
        branch: string;
        class: string;
        dob: string;
        duration: string;
        firstName: string;
        from: string;
        gender: string;
        gradyear: string;
        lastName: string;
        lastPassIssued: string;
        middleName: string;
        phoneNum: number;
        status: string;
        statusMessage: string;
        to: string;
        travelLane: string;
        idCardURL: string;
        idCardURL2: string;
        previousPassURL: string;
    }

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const concessionDetailsRef = collection(db, "ConcessionDetails");
                const querySnapshot = await getDocs(concessionDetailsRef);
                console.log(querySnapshot);

                const userList = querySnapshot.docs
                    .map((doc) => {
                        const data = doc.data();
                        return {
                            id : doc.id,
                            address: data.address || "N/A",
                            ageMonths: data.ageMonths || 0,
                            ageYears: data.ageYears || 0,
                            branch: data.branch || "N/A",
                            class: data.class || "N/A",
                            dob: data.dob && data.dob.seconds ? new Date(data.dob.seconds * 1000).toLocaleDateString() : "N/A",
                            duration: data.duration || "N/A",
                            firstName: data.firstName || "N/A",
                            from: data.from || "N/A",
                            gender: data.gender || "N/A",
                            gradyear: data.gradyear || "N/A",
                            lastName: data.lastName || "N/A",
                            lastPassIssued: data.lastPassIssued && data.lastPassIssued.seconds ? new Date(data.lastPassIssued.seconds * 1000).toLocaleDateString() : "N/A",
                            middleName: data.middleName || "N/A",
                            phoneNum: data.phoneNum || 0,
                            status: data.status || "N/A",
                            statusMessage: data.statusMessage || "N/A",
                            to: data.to || "N/A",
                            travelLane: data.travelLane || "N/A",
                            idCardURL: data.idCardURL || "N/A",
                            idCardURL2: data.idCardURL2 || "N/A",
                            previousPassURL: data.previousPassURL || "N/A",
                        };
                    })
                    .filter((item) => item.status === 'unserviced');

                    userList.forEach((item) => {
                        console.log(item.id);
                    });

                setData(userList);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleCardUpdate = (id: string) => {
        // Update the state to remove the card with the specified id
        setData(data.filter(item => item.id !== id));
    };

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                data.length > 0 ? (
                    <div className="flex flex-col space-y-2">
                        {data.map((item, index) => (
                            <PendingCard
                                key={index}
                                id={item.id}
                                firstName={item.firstName}
                                middleName={item.middleName}
                                lastName={item.lastName}
                                gender={item.gender}
                                from={item.from}
                                to={item.to}
                                travelClass={item.class}
                                duration={item.duration}
                                lastPassIssued={item.lastPassIssued}
                                branch={item.branch}
                                gradyear={item.gradyear}
                                address={item.address}
                                dob={item.dob}
                                ageYears={item.ageYears}
                                ageMonths={item.ageMonths}
                                phoneNum={item.phoneNum}
                                statusMessage={item.statusMessage}
                                onCardUpdate={handleCardUpdate}
                                idCardURL={item.idCardURL}
                                idCardURL2={item.idCardURL2}
                                previousPassURL={item.previousPassURL}
                            />
                        ))}
                    </div>
                ) : (
                    <p>No pending requests</p>
                )
            )}
        </div>
    );
};

export default PendingRequests;