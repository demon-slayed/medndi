import { useState, useEffect } from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { STATUS_LABELS, statusBadgeClass } from '@/lib/applicationStatus';

export default function ApplicationStatusStepper({currentStatus}) {
  const [steps, setSteps] = useState([]);
  useEffect(() => {
    const allSteps = [
      {
        key: 'initilal_assessment',
        title: STATUS_LABELS.initilal_assessment,
        description: 'Review of basic eligibility criteria and preliminary application documents',
      },
      {
        key: 'document_verification',
        title: STATUS_LABELS.document_verification,
        description: 'Verification of submitted documents including identification, certifications, and references',
      },
      {
        key: 'board_meeting',
        title: STATUS_LABELS.board_meeting,
        description: 'Review of medical history and current health status by qualified medical professionals',
      },
      {
        key: 'travel_accomodation',
        title: STATUS_LABELS.travel_accomodation,
        description: 'Planning and arrangement of travel logistics and accommodation details',
      },
      {
        key: 'insurance',
        title: STATUS_LABELS.insurance,
        description: 'Processing of required insurance coverage and policy documentation',
      },
      {
        key: 'approved',
        title: 'Final Approval',
        description: 'Final review and approval of complete application package',
      }
    ];

    const currentStepIndex = allSteps.findIndex(s => s.key === currentStatus);
    const isApproved = currentStatus === 'approved';

    const processedSteps = allSteps.map((step, index) => {
      let status = 'pending';
      if (isApproved || index < currentStepIndex) {
        status = 'completed';
      } else if (index === currentStepIndex) {
        status = 'in-progress';
      }
      return { ...step, status };
    });

    setSteps(processedSteps);
  }, [currentStatus]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <Check className="w-4 h-4 text-white" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-white" />;
      default:
        return <span className="w-2 h-2 rounded-full bg-gray-300" />;
    }
  };

  const circleClass = (status) =>
    status === 'completed'
      ? 'bg-green-500'
      : status === 'in-progress'
      ? 'bg-gradient-to-r from-[#3252DF] to-[#4466ff] ring-4 ring-blue-100'
      : 'bg-white border-2 border-gray-200';

  const lineClass = (status) => (status === 'completed' ? 'bg-green-500' : 'bg-gray-200');

  return (
    <div className="w-full">
      <ol className="relative">
        {steps.map((step, index) => (
          <li key={step.key} className="relative flex gap-4 pb-6 last:pb-0">
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <span
                aria-hidden="true"
                className={`absolute left-4 top-8 -ml-px h-[calc(100%-2rem)] w-0.5 ${lineClass(step.status)}`}
              />
            )}
            <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${circleClass(step.status)}`}>
              {getStatusIcon(step.status)}
            </div>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className={`font-semibold ${step.status === 'pending' ? 'text-gray-500' : 'text-gray-900'}`}>
                  {step.title}
                </h3>
                {step.status !== 'pending' && (
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      step.status === 'in-progress' ? statusBadgeClass(step.key) : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {step.status === 'in-progress' ? 'In progress' : 'Completed'}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-600">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      {/* Rejected state notification (only show if status is rejected) */}
      {currentStatus === 'rejected' && (
        <div className="flex items-start gap-3 p-4 mt-4 bg-red-50 rounded-xl border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-700">Application not approved</h4>
            <p className="text-sm text-red-600">Our team couldn&apos;t approve this request. Please contact care@medndi.com for next steps.</p>
          </div>
        </div>
      )}
    </div>
  );
}
