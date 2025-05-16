import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/slices/cartSlice"; 
import {toast} from "react-toastify";
import {useTranslation} from "react-i18next";


const AddToCartButton = ({ course }) => {
  const dispatch = useDispatch();
  const {t } = useTranslation(); 
  const handleAddToCart = () => {
    try {
      dispatch(addToCart(course));
      toast.success("Course added to cart successfully! 🎉");
    } catch (error) {
      toast.error("You have already added this course! ⚡");
    }
  };

  return (
    <button onClick={handleAddToCart} className="btn_style add_to_cart">
     {t("class_room.add_to_cart")}
    </button>
  );
};

export default AddToCartButton;
