import { 
  CalendarDaysIcon,
  PhoneXMarkIcon,
  ArrowPathIcon,
  MapPinIcon,
  ClockIcon,
  PauseCircleIcon,
  UserIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';

const FruitBoxGuidelines = () => {
  const guidelines = [
    {
      icon: <CalendarDaysIcon className="h-6 w-6 text-green-600" />,
      title: "Delivery Days",
      description: "Deliveries are made Monday to Saturday only. Sundays and Government Holidays are excluded."
    },
    {
      icon: <PhoneXMarkIcon className="h-6 w-6 text-green-600" />,
      title: "Missed Delivery Calls",
      description: "If you do not respond to the delivery partner's call, the box will be marked as delivered and no refund or replacement will be provided for that day."
    },
    {
      icon: <ArrowPathIcon className="h-6 w-6 text-green-600" />,
      title: "Box Return Policy",
      description: "Kindly return the previous day's empty box to the delivery partner each day."
    },
    {
      icon: <MapPinIcon className="h-6 w-6 text-green-600" />,
      title: "Fixed Location & Timing",
      description: "Once your subscription starts, no changes to delivery address or time slots will be allowed during that month."
    },
    {
      icon: <PauseCircleIcon className="h-6 w-6 text-green-600" />,
      title: "Pause Option",
      description: "You can pause your order for up to 4 days in a month. Please inform us by 5:00 PM on the previous day."
    },
    {
      icon: <UserIcon className="h-6 w-6 text-green-600" />,
      title: "Delivery Partner Instructions",
      description: "Please do not hand over payments, renewals, or discuss issues with the delivery person. Their role is only to deliver boxes and collect empty ones."
    },
    {
      icon: <ArrowsRightLeftIcon className="h-6 w-6 text-green-600" />,
      title: "Subscription Flexibility",
      description: "You may switch between the Bachelor and Family Box anytime. Just contact our customer support for changes."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-green-700 mb-6 text-center">
        Important Guidelines – 7Star Fruit Box
      </h1>
      
      <p className="text-gray-600 mb-8 italic">
        Dear Customer,<br />
        Please read the following points carefully to ensure smooth and uninterrupted service:
      </p>
      
      <div className="space-y-6">
        {guidelines.map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="flex-shrink-0 mt-1">
              {item.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
        Thank you for choosing 7Star Fruit Box!
      </div>
    </div>
  );
};

export default FruitBoxGuidelines;