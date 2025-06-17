// import mongoose from 'mongoose';

// export const adminCancellationSchema = new mongoose.Schema({
//   cancellationDate: {
//     type: Date,
//     required: true
//   },
//   message: {
//     type: String,
//     required: true
//   },
//   affectedSubscriptions: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Subscription'
//   }],
//   cancelledDeliveriesCount: {
//     type: Number,
//     default: 0
//   },
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   }
// }, { timestamps: true });

// // export default mongoose.model('AdminCancellationMessage', adminCancellationSchema);
// const AdminCancellationMessage = mongoose.model('AdminCancellationMessage', adminCancellationSchema);
// export default AdminCancellationMessage;