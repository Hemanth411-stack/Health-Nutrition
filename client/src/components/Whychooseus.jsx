import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHandHoldingHeart, 
  faBox, 
  faHeartbeat, 
  faCalendarAlt, 
  faTruck, 
  faMapMarkerAlt 
} from '@fortawesome/free-solid-svg-icons';

const Whychooseus = () => {
  return (
    <div>
      <section id="why-us" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to bringing you the freshest fruits with unmatched
              quality and service.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faHandHoldingHeart} className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">
                Handpicked Seasonal Fruits
              </h3>
              <p className="text-gray-600 text-center">
                We carefully select the freshest seasonal fruits to ensure you
                get the best quality and taste.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faBox} className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">
                Hygienic Packaging
              </h3>
              <p className="text-gray-600 text-center">
                All our fruits are packed in clean, eco-friendly packaging to
                maintain freshness and hygiene.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faHeartbeat} className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">
                Balanced Nutrition
              </h3>
              <p className="text-gray-600 text-center">
                Our fruit boxes are designed to provide a balanced mix of
                essential vitamins and nutrients.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">
                Delivery Schedule
              </h3>
              <p className="text-gray-600 text-center">
                We deliver Monday through Saturday, with no deliveries on
                Sundays and major festivals.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faTruck} className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">
                Free Home Delivery
              </h3>
              <p className="text-gray-600 text-center">
                Enjoy free delivery up to 12 KM from Yusufguda-Ameerpet area. No
                minimum order required.
              </p>
            </div>
            {/* Feature 6 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-2xl text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">
                Service Areas
              </h3>
              <p className="text-gray-600 text-center">
                Serving tech hubs like HITEC City, Gachibowli, Madhapur,
                Kukatpally and surrounding areas.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Whychooseus;