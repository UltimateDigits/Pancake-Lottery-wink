import React, { useState } from "react";
import { motion } from "framer-motion";
import { buyLottery } from "../integration";

const Buttons = ({ switchToModal2, ticketsToBuy, lotteryID }) => { // Receive the function as a prop
  const [isEnabled, setIsEnabled] = useState(false);

  const handleEnableClick = () => {
    setIsEnabled(true);
  };


  const handleBuy = async() => {
    try {

      console.log("ticsj",ticketsToBuy);
      console.log("lotteryID",lotteryID);
      const res = await buyLottery(lotteryID,ticketsToBuy)

      console.log("res",res);
    } catch (error) {
      console.log("errir in buy",error);
    }
  }


  return (
    <div className="space-y-2">
      {!isEnabled && (
        <motion.button
          className="bg-[#1FC7D4] hover:bg-[#1FC7D4]/50 transition-colors duration-200 p-2 w-full rounded-xl text-black font-bold"
          whileTap={{ scale: 0.9 }}
          onClick={handleEnableClick}
        >
          Enable
        </motion.button>
      )}

      {isEnabled && (
        <>
          <motion.button
            className="bg-[#1FC7D4] hover:bg-[#1FC7D4]/50 transition-colors duration-200 p-2 w-full rounded-xl text-black font-bold"
            whileTap={{ scale: 0.9 }}
            onClick={handleBuy} // Switch to Modal2 when clicked
          >
            Buy Instantly
          </motion.button>

          <motion.button
            className="border-2 border-[#1FC7D4] hover:border-[#1FC7D4]/80 text-[#1FC7D4] hover:text-[#1FC7D4]/80 transition-colors duration-200 p-2 w-full rounded-xl font-bold"
            whileTap={{ scale: 0.9 }}
            onClick={switchToModal2} // Switch to Modal2 when clicked
          >
            View/Edit Numbers
          </motion.button>
        </>
      )}
    </div>
  );
};

export default Buttons;
