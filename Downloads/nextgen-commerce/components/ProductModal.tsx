import React, { useState, useEffect } from 'react';
import type { Product, Review } from '../types';
import { getReviewsForProduct, submitReview } from '../services/reviewService';
import { XIcon } from './icons/XIcon';
import { PlusIcon } from './icons/PlusIcon';
import { StarIcon } from './icons/StarIcon';
import { BadgeCheckIcon } from './icons/BadgeCheckIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // State for the new review form
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSubmissionSuccess, setReviewSubmissionSuccess] = useState(false);
  const [reviewSubmissionError, setReviewSubmissionError] = useState<string | null>(null);


  useEffect(() => {
    setIsLoadingReviews(true);
    getReviewsForProduct(product.id)
      .then(setReviews)
      .finally(() => setIsLoadingReviews(false));
  }, [product.id]);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  const handleAddToCartClick = () => {
    onAddToCart(product, quantity);
  };
  
  const formatPrice = (price: number) => {
     return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(price);
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRating === 0) {
        setReviewSubmissionError("Please select a star rating before submitting.");
        return;
    }
    setIsSubmittingReview(true);
    setReviewSubmissionError(null);
    try {
        await submitReview({
            orderId: `prod-review-${product.id}-${Date.now()}`, 
            productId: product.id,
            rating: newRating,
            comment: newComment,
        });
        setReviewSubmissionSuccess(true);
    } catch (error) {
        setReviewSubmissionError("There was an error submitting your review. Please try again.");
    } finally {
        setIsSubmittingReview(false);
    }
  };
  
  const averageRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-secondary rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out animate-in fade-in-0 zoom-in-95 border border-slate-700"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 flex justify-end sticky top-0 bg-secondary/80 backdrop-blur-sm z-10">
            <button
                onClick={onClose}
                className="text-gray-400 hover:text-white hover:bg-slate-700 rounded-full p-2 transition-colors"
            >
                <XIcon className="w-6 h-6" />
                <span className="sr-only">Close</span>
            </button>
        </div>
        
        <div className="overflow-y-auto px-6 pb-6">
          <div className="grid md:grid-cols-2 gap-6">
              <div>
                  <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md"/>
              </div>
              <div className="flex flex-col">
                  <h2 className="text-3xl font-bold text-white">{product.name}</h2>
                  {reviews.length > 0 && (
                     <div className="flex items-center mt-2">
                        <div className="flex items-center">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon key={i} className={`w-5 h-5 ${i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-500'}`} />
                          ))}
                        </div>
                        <p className="ml-2 text-sm text-gray-400">{averageRating.toFixed(1)} ({reviews.length} reviews)</p>
                      </div>
                  )}
                  <p className="text-gray-400 mt-2">{product.description}</p>
                  <div className="mt-4">
                      <span className="text-3xl font-extrabold text-white">{formatPrice(product.price)}</span>
                      <span className="text-gray-400"> / {product.unit}</span>
                  </div>
                  
                  <div className="mt-auto pt-6">
                      <div className="flex items-center space-x-4 mb-4">
                          <p className="font-semibold text-gray-200">Quantity:</p>
                          <div className="flex items-center border border-slate-600 rounded-md bg-primary">
                              <button onClick={() => handleQuantityChange(-1)} className="px-3 py-2 text-gray-300 hover:bg-slate-700 rounded-l-md" aria-label="Decrease quantity">-</button>
                              <span className="px-4 py-2 text-lg font-semibold w-16 text-center text-white">{quantity}</span>
                              <button onClick={() => handleQuantityChange(1)} className="px-3 py-2 text-gray-300 hover:bg-slate-700 rounded-r-md" aria-label="Increase quantity">+</button>
                          </div>
                      </div>
                      <button 
                          onClick={handleAddToCartClick}
                          className="w-full py-3 bg-accent text-white font-bold rounded-lg shadow-md hover:bg-accent-hover transition-all flex items-center justify-center space-x-2"
                      >
                          <PlusIcon className="w-5 h-5"/>
                          <span>Add to Cart</span>
                      </button>
                  </div>
              </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-700">
            <h3 className="text-xl font-bold text-white mb-4">Customer Reviews</h3>
            {isLoadingReviews ? (
                <p className="text-gray-400">Loading reviews...</p>
            ) : reviews.length > 0 ? (
                <div className="space-y-6">
                    {reviews.map(review => (
                        <div key={review.id} className="border-b border-slate-800 pb-4">
                            <div className="flex items-center mb-1">
                                <div className="flex items-center">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <StarIcon key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-600'}`}/>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-300">{review.comment}</p>
                            <div className="flex items-center mt-2 text-sm text-gray-400">
                                <p className="font-semibold mr-2">{review.customerName}</p>
                                <BadgeCheckIcon className="w-4 h-4 text-green-500 mr-1"/>
                                <span>Verified Buyer</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400">No reviews yet for this product.</p>
            )}
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-700">
             <h3 className="text-xl font-bold text-white mb-4">Write a Review</h3>
             {reviewSubmissionSuccess ? (
                <div className="p-4 text-center bg-green-900/50 border border-green-700 rounded-md">
                    <h4 className="text-md font-semibold text-green-300">Review Submitted!</h4>
                    <p className="text-green-400">Thank you. Your review is pending approval from our team.</p>
                </div>
             ) : (
                <form onSubmit={handleReviewSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-300 mb-2">Your Rating</label>
                        <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            onClick={() => setNewRating(star)}
                            className="text-gray-600"
                            >
                            <StarIcon className={`w-8 h-8 transition-colors ${(hoverRating || newRating) >= star ? 'text-yellow-400' : 'text-gray-600'}`}/>
                            </button>
                        ))}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="new-comment" className="block text-sm font-medium text-gray-300">Your Comment (optional)</label>
                        <textarea
                            id="new-comment"
                            rows={4}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="mt-1 block w-full rounded-md bg-primary border-slate-600 shadow-sm focus:border-accent focus:ring-accent sm:text-sm p-2 text-gray-200"
                            placeholder="Tell us what you think..."
                        />
                    </div>
                    {reviewSubmissionError && <p className="mt-2 text-sm text-red-400">{reviewSubmissionError}</p>}
                    <div className="mt-4">
                        <button type="submit" disabled={isSubmittingReview} className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent hover:bg-accent-hover disabled:bg-slate-600">
                           {isSubmittingReview ? <SpinnerIcon className="h-5 w-5" /> : 'Submit Review'}
                        </button>
                    </div>
                </form>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductModal;
