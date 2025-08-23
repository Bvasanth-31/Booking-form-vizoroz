import React, { useState, useEffect } from 'react';
import  { useParams, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import './Form.css';
import axios from 'axios';


const Form = () => {

     const { id } = useParams(); 
    const navigate = useNavigate(); 

    const initialFormValues = {
        yard: "",
        linerName: "",
        referenceNumber: "",
        type: "",
        bookingDate: "",
        bookingValidity: "",
        releaseTo: "",
        vesselCarrier: "",
        vesselName: "",
        voyageNumber: "",
        arrivalDate: new Date().toISOString().split("T")[0],
        departureDate: "",
        loadingPort: "",
        dischargePort: "",
        destination: "",
        status: "",
        outContract: "",
        blNumber: "",
        remarks: "",
    };

    const [formData, setFormData] = useState(initialFormValues);
    const [errors, setErrors] = useState({});
    const [showExtraFields, setShowExtraFields] = useState(true);
    const [loading, setLoading] = useState(false);



        useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5181/api/booking/${id}`)
                .then(res => {
                    const data = res.data;
                    setFormData({
                        ...data,
                        bookingDate: data.bookingDate?.split("T")[0] || "",
                        bookingValidity: data.validityDate?.split("T")[0] || "",
                        departureDate: data.departureDate?.split("T")[0] || "",
                    });
                })
                .catch(err => console.error("Error fetching booking:", err));
        }
    }, [id]);




    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "yard" && value === "HK") {
            const randomRef = generateReferenceNumber();
            setFormData((prev) => ({
                ...prev,
                referenceNumber: randomRef,
            }));
        }

        if (name === "status") {
            setShowExtraFields(value !== "Expired");
        }
    };

    const generateReferenceNumber = () => {
        const letters = [...Array(4)]
            .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
            .join("");
        const numbers = Math.floor(100000 + Math.random() * 900000).toString();
        return letters + numbers;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.yard) newErrors.yard = "Yard is required";
        if (!formData.linerName) newErrors.linerName = "Liner Name is required";

        if (!/^[A-Z]{4}\d{6}$/.test(formData.referenceNumber)) {
            newErrors.referenceNumber = "Reference number must be 4 letters followed by 6 digits";
        }

        if (!formData.releaseTo || !/^[a-z0-9]+$/i.test(formData.releaseTo))
            newErrors.releaseTo = "Release To must be alphanumeric";

        if (!formData.bookingDate) newErrors.bookingDate = "Booking Date required";

        const bookingDate = new Date(formData.bookingDate);
        const validityDate = new Date(formData.bookingValidity);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (!formData.bookingValidity) {
            newErrors.bookingValidity = "booking date is required ";
        } else if (validityDate < bookingDate || validityDate > today) {
            newErrors.bookingValidity = "Booking validity must be between booking date and today";
        }

        if (!formData.vesselName || !/^[a-z0-9 ]+$/i.test(formData.vesselName))
            newErrors.vesselName = "Vessel Name must be alphanumeric";

        if (!formData.voyageNumber || !/^\d+$/.test(formData.voyageNumber))
            newErrors.voyageNumber = "Voyage Number must be a number";

        const departure = new Date(formData.departureDate);
        if (!formData.departureDate || departure <= today) {
            newErrors.departureDate = "Departure Date must be a future date";
        }

        //if (!formData.loadingPort) newErrors.loadingPort = "";
        //  if (!formData.dischargePort) newErrors.dischargePort = "";
        //  if (!formData.destination) newErrors.destination = "";//

        if (!formData.status) newErrors.status = "Status is required";

        if (formData.status !== "Expired") {
            if (!formData.outContract) newErrors.outContract = "Out Contract is required";
            if (!formData.blNumber || !/^\d{1,10}$/.test(formData.blNumber))
                newErrors.blNumber = "BL Number must be numeric with max 10 digits";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (validateForm()) {
            try {
                const payload = {
                    yard: formData.yard,
                    linerName: formData.linerName,
                    referenceNumber: formData.referenceNumber,
                    type: formData.type,
                    bookingDate: new Date(formData.bookingDate).toISOString(),
                    validityDate: new Date(formData.bookingValidity).toISOString(),
                    releaseTo: formData.releaseTo,
                    vesselCarrier: formData.vesselCarrier,
                    vesselName: formData.vesselName,
                    voyageNumber: parseInt(formData.voyageNumber),
                    arrivalDate: new Date().toISOString(),
                    departureDate: new Date(formData.departureDate).toISOString(),
                    loadingPort: formData.loadingPort,
                    dischargePort: formData.dischargePort,
                    destination: formData.destination,
                    status: formData.status,
                    outContract: formData.status !== "Expired" ? formData.outContract : "",
                    blNumber: formData.status !== "Expired" ? parseInt(formData.blNumber) : 0,
                };

                if (id) {
                    
                    await axios.put(`http://localhost:5181/api/booking/${id}`, payload);
                     toast.success("Booking updated successfully! ");
                } else {
                    
                    await axios.post("http://localhost:5181/api/booking", payload);
                     toast.success("Booking created successfully! ");
                }

                setFormData({ ...initialFormValues });
                navigate("/"); 
            } catch (err) {
                console.error("Submission error:", err);
             toast.error("Something went wrong while saving ");
            }
        }

        setLoading(false);
    };


    return (
        <form onSubmit={handleSubmit} className="form-container">
            <div className="form-grid">
                <div>
                    <label>Yard<span>*</span></label>
                    <select name="yard" value={formData.yard} onChange={handleChange} >
                        <option value="">Select</option>
                        <option value="HK">HK</option>
                        <option value="AU">AU</option>
                        <option value="OT">OT</option>
                    
                    </select>
                    {errors.yard && <span>{errors.yard}</span>}
                </div>

                <div>
                    <label>Liner Name <span>*</span></label>
                    <select name="linerName" value={formData.linerName} onChange={handleChange} >
                        <option value="">Select</option>
                        <option value="JACK">JACK</option>
                        <option value="SAMSON">SAMSON</option>
                        <option value="JOHN">JOHN</option>
                    </select>
                    {errors.linerName && <span>{errors.linerName}</span>}
                </div>

                <div>
                    <label>Reference Number <span>*</span></label>
                    <input type="text" name="referenceNumber" value={formData.referenceNumber} onChange={handleChange} readOnly={formData.yard === "HK"} />
                    {errors.referenceNumber && <span>{errors.referenceNumber}</span>}
                </div>

                <div>
                    <label>Type <span>*</span></label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="Type 1">Type 1</option>
                        <option value="Type 2">Type 2</option>
                    </select>
                </div>

                <div>
                    <label>Booking Date <span>*</span></label>
                    <input type="date" name="bookingDate" value={formData.bookingDate} onChange={handleChange} />
                    {errors.bookingDate && <span>{errors.bookingDate}</span>}
                </div>

                <div>
                    <label>Booking Validity <span>*</span></label>
                    <input type="date" name="bookingValidity" value={formData.bookingValidity} onChange={handleChange} />
                    {errors.bookingValidity && <span>{errors.bookingValidity}</span>}
                </div>

                <div>
                    <label>Release To</label>
                    <input type="text" name="releaseTo" value={formData.releaseTo} onChange={handleChange} />
                    {errors.releaseTo && <span>{errors.releaseTo}</span>}
                </div>

                <div>
                    <label>Vessel Carrier <span></span></label>
                    <select name="vesselCarrier" value={formData.vesselCarrier} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="MAERSK">MAERSK</option>
                        <option value="CMGCM">CMGCM</option>
                        <option value="MSC">MSC</option>
                    </select>
                </div>

                <div>
                    <label>Vessel Name <span></span></label>
                    <input type="text" name="vesselName" value={formData.vesselName} onChange={handleChange} />
                    {errors.vesselName && <span>{errors.vesselName}</span>}
                </div>

                <div>
                    <label>Voyage Number <span></span></label>
                    <input type="number" name="voyageNumber" value={formData.voyageNumber} onChange={handleChange} />
                    {errors.voyageNumber && <span>{errors.voyageNumber}</span>}
                </div>

                <div>
                    <label>Arrival Date<span>*</span></label>
                    <input type="text" name="arrivalDate" value={formData.arrivalDate} readOnly />
                </div>

                <div>
                    <label>Departure Date <span>*</span></label>
                    <input type="date" name="departureDate" value={formData.departureDate} onChange={handleChange} />
                    {errors.departureDate && <span>{errors.departureDate}</span>}
                </div>

                <div>
                    <label>Loading Port</label>
                    <input type="text" name="loadingPort" value={formData.loadingPort} onChange={handleChange} />

                </div>

                <div>
                    <label>Discharge Port </label>
                    <input type="text" name="dischargePort" value={formData.dischargePort} onChange={handleChange} />

                </div>

                <div>
                    <label>Destination </label>
                    <input type="text" name="destination" value={formData.destination} onChange={handleChange} />

                </div>

                <div>
                    <label>Status <span>*</span></label>
                    <select name="status" value={formData.status} onChange={handleChange} required>
                        <option value="">Select</option>
                        <option value="Pending">Pending</option>
                        <option value="Completed">Completed</option>
                        <option value="Expired">Expired</option>
                    </select>
                    {errors.status && <span>{errors.status}</span>}
                </div>

                {showExtraFields && (
                    <>
                        <div>
                            <label>Out Contract</label>
                            <input type="text" name="outContract" value={formData.outContract} onChange={handleChange} />

                        </div>

                        <div>
                            <label>BL Number</label>
                            <input type="text" name="blNumber" value={formData.blNumber} onChange={handleChange} />

                        </div>

                        <div>
                            <label>Remarks</label>
                            <input type="text" name="remarks" value={formData.remarks} onChange={handleChange} />
                        </div>
                    </>
                )}
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <div className="spinner"></div> : 'Save'}
            </button>


        </form>
    );
};

export default Form;





