import { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

export default function ApplicationStatusStepper({currentStatus}) {
  const [steps, setSteps] = useState([]);
  useEffect(() => {
    const allSteps = [
      {
        key: 'initilal_assessment',
        title: 'Initial Assessment',
        description: 'Review of basic eligibility criteria and preliminary application documents',
      },
      {
        key: 'document_verification',
        title: 'Document Verification',
        description: 'Verification of submitted documents including identification, certifications, and references',
      },
      {
        key: 'board_meeting',
        title: 'Medical Board Meeting',
        description: 'Review of medical history and current health status by qualified medical professionals',
      },
      {
        key: 'travel_accomodation',
        title: 'Travel & Accommodation',
        description: 'Planning and arrangement of travel logistics and accommodation details',
      },
      {
        key: 'insurance',
        title: 'Insurance',
        description: 'Processing of required insurance coverage and policy documentation',
      },
      {
        key: 'approved',
        title: 'Final Approval',
        description: 'Final review and approval of complete application package',
      }
    ];

    // Add status and date to each step
    const processedSteps = allSteps.map((step, index) => {
      // Find current step index
      const currentStepIndex = allSteps.findIndex(s => s.key === currentStatus);
      
      let status = 'pending';
      if (index < currentStepIndex) {
        status = 'completed';
      } else if (index === currentStepIndex) {
        status = 'in-progress';
      }

      // Generate a realistic date (for demo purposes)
      const today = new Date();
      const date = new Date(today);
      date.setDate(today.getDate() - (currentStepIndex - index) + index);
      
      return {
        ...step,
        status,
        date: index <= currentStepIndex ? date.toISOString().split('T')[0] : ''
      };
    });

    setSteps(processedSteps);
  }, [currentStatus]);

  // Helper function to get the appropriate icon for the step status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-300" />;
    }
  };

  // Helper function to get the appropriate color for the connecting line
  const getStepperLineColor = (currentStatus, nextStatus) => {
    if (currentStatus === 'completed' && nextStatus === 'completed') {
      return 'bg-green-500';
    } else if (currentStatus === 'completed' && nextStatus === 'in-progress') {
      return 'bg-gradient-to-b from-green-500 to-blue-500';
    } else if (currentStatus === 'in-progress') {
      return 'bg-gradient-to-b from-blue-500 to-gray-300';
    } else {
      return 'bg-gray-300';
    }
  };

  // Function to format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4 px-4 pt-2">Application Status</h2>
      <div className="relative pt-4">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex items-start mb-8 px-4">
              {/* Step number circle with icon */}
              <div className="relative flex items-center justify-center z-10 bg-white">
                <div
                  className={`rounded-full p-1 ${
                    step.status === "completed"
                      ? "bg-green-100"
                      : step.status === "in-progress"
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  {getStatusIcon(step.status)}
                </div>
              </div>

              {/* Step Content */}
              <div className="ml-4 flex-grow">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {step.title}
                  </h3>
                  <span className="text-sm text-gray-500 mt-1 md:mt-0">
                    {formatDate(step.date)}
                  </span>
                </div>
                <p className="text-gray-600 mt-1 text-sm">
                  {step.description}
                </p>
                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${
                    step.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : step.status === "in-progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {step.status.charAt(0).toUpperCase() + step.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div className="absolute left-5 top-0 -ml-px h-full w-0.5">
                <div
                  className={`h-full ${getStepperLineColor(
                    step.status,
                    steps[index + 1].status
                  )}`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Rejected state notification (only show if status is rejected) */}
      {currentStatus === 'rejected' && (
        <div className="flex items-center p-4 mt-2 bg-red-50 rounded-lg border border-red-200">
          <AlertCircle className="text-red-600 mr-3" />
          <div>
            <h4 className="font-semibold text-red-700">Application Rejected</h4>
            <p className="text-sm text-red-600">Your application has been rejected. Please contact support for more information.</p>
          </div>
        </div>
      )}
    </div>
  );
}