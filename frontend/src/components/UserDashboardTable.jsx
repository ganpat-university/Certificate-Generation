import { useState, useEffect } from "react";
import { IoCheckmark } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import Sidebar from "./Navbar";
import Modal from "react-modal";
import html2pdf from "html2pdf.js";
import { IoIosArrowRoundDown } from "react-icons/io";

// Style for the modal
const customStyles = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        maxWidth: "500px", // Adjust max width as needed
    },
};

const UserDashboardTable = () => {
    const [data, setData] = useState([]);
    const [selectedCertificate, setSelectedCertificate] = useState(null); // State to manage selected certificate
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal open/close

    const fetchData = async () => {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:7000/course/getCourse`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            const res = await response.json();
            console.log(res);
            if (res.status === "Success") {
                // Filter data where status is 0
                setData(res?.data);
            }
        } catch (error) {
            console.error("Error fetching templates:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Function to handle opening modal and set selected certificate
    const openModal = (certificateHtml) => {
        setSelectedCertificate(certificateHtml);
        setIsModalOpen(true);
    };

    // Function to handle closing modal
    const closeModal = () => {
        setSelectedCertificate(null);
        setIsModalOpen(false);
    };

    // Function to download certificate as PDF
    const downloadCertificateAsPDF = () => {
        const element = document.getElementById("certificateContent");

        html2pdf()
            .from(element)
            .save();
    };

    return (
        <div>
            <Sidebar />
            <div className="ml-48 p-8">
                <h1 className="text-2xl font-semibold mb-4">Recent Requests</h1>
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="py-2">ID</th>
                            <th className="py-2">Username</th>
                            <th className="py-2">Template ID</th>
                            <th className="py-2">Course Name</th>
                            <th className="py-2">Actions</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item) => (
                            <tr key={item.id} className="border-b border-gray-200">
                                <td className="py-3 text-center">{item.template_Id}</td>
                                <td className="py-3 text-center">{item.user_name}</td>
                                <td className="py-3 text-center">{item.template_Id}</td>
                                <td className="py-3 text-center">{item.course_name}</td>
                                <td className="py-3 text-center">
                                    {item.status === "0" ? "Pending" : item.status === "1" ? "Accepted" : "Rejected"}
                                </td>
                                <td>
                                    {/* Button to open modal */}
                                    <button onClick={() => openModal(item.certificate)} disabled={item.status !== "1"}>Open Certi</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                {/* Certificate content */}
                <div id="certificateContent" dangerouslySetInnerHTML={{ __html: selectedCertificate }}></div>
                {/* Download PDF button */}
                <button onClick={downloadCertificateAsPDF} className="px-4 py-2 bg-blue-700 text-white rounded-md my-4 flex items-center"><IoIosArrowRoundDown className="text-2xl"/> Download PDF</button>
                {/* Close modal button */}
                <button onClick={closeModal} className="absolute top-5 right-4">
                    <RxCross2 size={24} />
                </button>
            </Modal>
        </div>
    );
};

export default UserDashboardTable;
