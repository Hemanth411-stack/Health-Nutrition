import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock,
  faSyncAlt,
  faGift,
  faPercentage,
  faUndo,
  faUserFriends
} from '@fortawesome/free-solid-svg-icons';

const Extrabenefits = () => {
  return (
    <div>
      <section id="benefits" className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Extra Benefits
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We go beyond just delivering fruits. Enjoy these additional perks
              when you subscribe to 7Star Fruit Box.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faClock} className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">
                Flexible Delivery Slots
              </h3>
              <p className="text-gray-600 text-center">
                Choose from morning or evening delivery slots to fit your
                schedule perfectly.
              </p>
            </div>
            {/* Benefit 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faSyncAlt} className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">
                No Repetition Guarantee
              </h3>
              <p className="text-gray-600 text-center">
                Enjoy a variety of fruits every day with our no-repetition
                policy within the same week.
              </p>
            </div>
            {/* Benefit 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faGift} className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">
                Seasonal Surprises
              </h3>
              <p className="text-gray-600 text-center">
                Get special festival and seasonal fruit surprises as
                complimentary add-ons.
              </p>
            </div>
            {/* Benefit 4 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faPercentage} className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">
                Renewal Special Offer
              </h3>
              <p className="text-gray-600 text-center">
                Enjoy special discounts when you renew your subscription before
                it expires.
              </p>
            </div>
            {/* Benefit 5 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faUndo} className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">
                Missed Delivery Refund
              </h3>
              <p className="text-gray-600 text-center">
                Get a refund guarantee for up to 2 days of missed deliveries per
                month.
              </p>
            </div>
            {/* Benefit 6 */}
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                <FontAwesomeIcon icon={faUserFriends} className="text-2xl text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-center mb-3">
                Referral Reward
              </h3>
              <p className="text-gray-600 text-center">
                Refer a friend and get ₹100 OFF on your next fruit box. Share
                the health!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Extrabenefits;