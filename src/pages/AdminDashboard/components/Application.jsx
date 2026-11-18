import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const Application = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDetailView, setIsDetailView] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  // Status options based on your schema
  const statusOptions = [
    'initilal_assessment',
    'document_verification',
    'board_meeting',
    'travel_accomodation',
    'insurance',
    'approved',
    'rejected'
  ];

  // Status badge colors
  const statusColors = {
    initilal_assessment: 'bg-yellow-100 text-yellow-800',
    document_verification: 'bg-blue-100 text-blue-800',
    board_meeting: 'bg-purple-100 text-purple-800',
    travel_accomodation: 'bg-indigo-100 text-indigo-800',
    insurance: 'bg-emerald-100 text-emerald-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800'
  };

  // Fetch all applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/application/getAll`,
          { withCredentials: true }
        );
        setApplications(res.data);
      } catch (error) {
        console.error('Failed to fetch applications:', error);
        toast.error('Failed to load applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Handle application selection for detailed view
  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    console.log("selected application is: ", application);
    
    setIsDetailView(true);
  };

  // Handle back button from detailed view
  const handleBack = () => {
    setIsDetailView(false);
    setSelectedApplication(null);
  };

  // Handle status update
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/application/update/${selectedApplication._id}`,
        { status: newStatus },
        { withCredentials: true }
      );
      
      // Update local state
      setSelectedApplication({ ...selectedApplication, status: newStatus });
      
      // Update in applications list
      setApplications(applications.map(app => 
        app._id === selectedApplication._id 
          ? { ...app, status: newStatus } 
          : app
      ));
      
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update application status');
    }
  };

  // Filter applications by status
  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === statusFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!isDetailView ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Applications Management</h1>
            <div className="flex items-center">
              <label htmlFor="statusFilter" className="mr-2 text-gray-700">Filter by status:</label>
              <select
                id="statusFilter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Applications</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredApplications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No applications found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApplications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleViewApplication(application)}
                >
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-xl font-semibold text-gray-800">
                        ID: {application.application_id}
                      </h2>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[application.status]}`}>
                        {application.status.replace(/_/g, ' ')}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Treatment: </span> 
                      {application.treatment_id?.treatment_name || 'Not specified'}
                    </p>
                    
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Hospital: </span>
                      {application.hospital_id?.hospital_name || 'Not specified'}
                    </p>
                    
                    <p className="text-gray-600 mb-4">
                      <span className="font-medium">Appointment: </span>
                      {application.treatmentdateandtime || 'Not scheduled'}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 text-sm">
                        {new Date(application.created_at).toLocaleDateString()}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        application.payment_status === 'Completed' 
                          ? 'bg-green-100 text-green-800' 
                          : application.payment_status === 'Failed'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {application.payment_status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        selectedApplication && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <button 
                onClick={handleBack} 
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Applications
              </button>
              
              <div className="flex items-center">
                <h3 className="mr-3 text-gray-700 font-medium">Update Status:</h3>
                <select
                  value={selectedApplication.status}
                  onChange={handleStatusChange}
                  className="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Application Details */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-blue-800">
                Application Details
              </h1>
              <p className="text-gray-600 text-lg mt-2">
                ID: {selectedApplication.application_id}
              </p>
              <div className="mt-2 inline-block">
                <span className={`px-4 py-1 rounded-full text-sm font-medium ${statusColors[selectedApplication.status]}`}>
                  {selectedApplication.status.replace(/_/g, ' ')}
                </span>
              </div>
            </div>

            {/* Appointment details */}
            <div className="mb-6 bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
              <h2 className="font-bold text-xl text-blue-800 mb-2">
                Appointment Details
              </h2>
              <p className="text-blue-700 font-medium text-lg">
                {selectedApplication.treatmentdateandtime || 'Not scheduled yet'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Treatment Details */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                  Treatment
                </h2>
                <div className="pl-3 border-l-2 border-blue-400">
                  <p className="font-medium text-gray-800 text-lg">
                    {selectedApplication.treatment_id?.treatment_name || 'Not specified'}
                  </p>
                  <p className="text-base text-gray-600">
                    Duration: {selectedApplication.treatment_id?.duration || 'Not specified'}
                  </p>
                  <p className="text-base text-gray-600">
                    Success Rate: {selectedApplication.treatment_id?.success_rate || 'Not specified'}
                  </p>
                  <p className="text-base font-medium text-gray-800 mt-2">
                    Cost: 
                    {selectedApplication.treatment_id?.estimated_cost ? (
                      ` ₹${selectedApplication.treatment_id.estimated_cost.min?.toLocaleString()} - 
                      ₹${selectedApplication.treatment_id.estimated_cost.max?.toLocaleString()}`
                    ) : (
                      ' Not specified'
                    )}
                  </p>
                </div>
              </div>

              {/* Hospital Details */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    ></path>
                  </svg>
                  Hospital
                </h2>
                <div className="pl-3 border-l-2 border-blue-400">
                  <p className="font-medium text-gray-800 text-lg">
                    {selectedApplication.hospital_id?.hospital_name || 'Not specified'}
                  </p>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-500 mr-1 text-lg">★</span>
                    <span className="text-base text-gray-600">
                      {selectedApplication.hospital_id?.rating || 'N/A'}/5
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedApplication.hospital_id?.address || 'No address provided'}
                  </p>
                </div>
              </div>

              {/* Insurance */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    ></path>
                  </svg>
                  Insurance
                </h2>
                <div className="pl-3 border-l-2 border-blue-400">
                  {selectedApplication.insurance_id ? (
                    <>
                      <p className="font-medium text-gray-800 text-lg">
                        {selectedApplication.insurance_id.name}
                      </p>
                      {selectedApplication.insurance_id.features && (
                        <ul className="text-base text-gray-600 mt-2 list-disc list-inside">
                          {selectedApplication.insurance_id.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      )}
                      {selectedApplication.insurance_id.price && (
                        <p className="text-base font-medium text-gray-800 mt-2">
                          ₹{selectedApplication.insurance_id.price.toLocaleString()}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-base text-gray-600">No insurance selected</p>
                  )}
                </div>
              </div>

              {/* Accommodation */}
              <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                  <svg
                    className="w-6 h-6 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    ></path>
                  </svg>
                  Accommodation
                </h2>
                <div className="pl-3 border-l-2 border-blue-400">
                  {selectedApplication.hotel_id ? (
                    <>
                      <p className="font-medium text-gray-800 text-lg">
                        {selectedApplication.hotel_id.hotel_name}
                      </p>
                      <p className="text-base text-gray-600">
                        {selectedApplication.hotel_id.distance || 'Distance not specified'}
                      </p>
                      {selectedApplication.hotel_id.price_per_night && (
                        <p className="text-base font-medium text-gray-800 mt-2">
                          ₹{selectedApplication.hotel_id.price_per_night.toLocaleString()} per night
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-base text-gray-600">No accommodation selected</p>
                  )}
                </div>
              </div>
            </div>

            {/* Travel Details */}
            <div className="mb-6 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  ></path>
                </svg>
                Travel Details
              </h2>
              {selectedApplication.travel_plan && selectedApplication.travel_plan.travelMode ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="pl-3 border-l-2 border-blue-400">
                    <div className="flex items-center text-base">
                      <span className="font-medium text-gray-700">From:</span>
                      <span className="ml-2 text-gray-800">
                        {selectedApplication.travel_plan.sourceCity || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center text-base mt-2">
                      <span className="font-medium text-gray-700">To:</span>
                      <span className="ml-2 text-gray-800">
                        {selectedApplication.travel_plan.destinationCity || 'Not specified'}
                      </span>
                    </div>
                  </div>
                  <div className="pl-3 border-l-2 border-blue-400">
                    <div className="flex items-center text-base">
                      <span className="font-medium text-gray-700">Mode:</span>
                      <span className="ml-2 text-gray-800 capitalize">
                        {selectedApplication.travel_plan.travelMode || 'Not specified'}
                      </span>
                    </div>
                    <div className="flex items-center text-base mt-2">
                      <span className="font-medium text-gray-700 mr-2">
                        Local Transport:
                      </span>
                      {selectedApplication.travel_plan.selectedLocalTransport ? (
                        <span className="ml-2 text-gray-800">
                          {selectedApplication.travel_plan.selectedLocalTransport}
                        </span>
                      ) : (
                        <span className="text-base text-gray-600">Not selected</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-base text-gray-600">No travel details provided</p>
              )}
            </div>

            {/* Cost Summary */}
            <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
              <h2 className="font-bold text-xl text-gray-800 mb-3">Cost Summary</h2>
              <div className="grid grid-cols-2 gap-3 text-base">
                <div className="text-gray-600">Treatment (estimated):</div>
                <div className="text-right font-medium">
                  {selectedApplication.treatment_id?.estimated_cost?.max ? 
                    `₹${selectedApplication.treatment_id.estimated_cost.max.toLocaleString()}` : 
                    'Not specified'}
                </div>

                <div className="text-gray-600">Accommodation:</div>
                <div className="text-right font-medium">
                  {selectedApplication.hotel_id?.price_per_night ? 
                    `₹${selectedApplication.hotel_id.price_per_night.toLocaleString()}` : 
                    <span className="text-gray-600">Not selected</span>}
                </div>

                <div className="text-gray-600">Insurance:</div>
                <div className="text-right font-medium">
                  {selectedApplication.insurance_id?.price ? 
                    `₹${selectedApplication.insurance_id.price.toLocaleString()}` : 
                    <span className="text-gray-600">Not selected</span>}
                </div>

                <div className="text-gray-600">Travel:</div>
                {selectedApplication.travel_plan?.travelMode ? (
                  <div className="text-right font-medium">
                    Travel cost update after review
                  </div>
                ) : (
                  <span className="text-gray-600 text-right font-medium">
                    Not selected
                  </span>
                )}
                <div className="border-t pt-2 text-gray-800 font-medium text-lg">
                  Estimated Total:
                </div>
                <div className="border-t pt-2 text-right text-blue-700 font-bold text-lg">
                  {selectedApplication.total_cost ? 
                    `₹${selectedApplication.total_cost.toLocaleString()}` : 
                    'Calculating...'}
                </div>
              </div>

              {/* Payment Status */}
              <div className="mt-4 text-right">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                  selectedApplication.payment_status === 'Completed' 
                    ? 'bg-green-100 text-green-700' 
                    : selectedApplication.payment_status === 'Failed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    {selectedApplication.payment_status === 'Completed' ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    ) : selectedApplication.payment_status === 'Failed' ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    ) : (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    )}
                  </svg>
                  Payment {selectedApplication.payment_status}
                </span>
              </div>
            </div>

            {/* User Information */}
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm mb-6">
              <h2 className="font-bold text-xl text-gray-800 mb-3 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                Patient Information
              </h2>
              <div className="pl-3 border-l-2 border-blue-400">
                <p className="text-base text-gray-600">
                  <span className="font-medium">User ID: </span> 
                  {selectedApplication.user_id.user_id || 'Not available'}
                </p>
                <p className="text-base text-gray-600 mt-1">
                  <span className="font-medium">Created at: </span> 
                  {new Date(selectedApplication.created_at).toLocaleString()}
                </p>
                <p className="text-base text-gray-600 mt-1">
                  <span className="font-medium">Last updated: </span> 
                  {new Date(selectedApplication.updated_at).toLocaleString()}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end mt-8 space-x-4">
              <button
                className="py-2 px-6 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors font-medium"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                className="py-2 px-6 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
                onClick={() => window.print()}
              >
                Print Details
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default Application;