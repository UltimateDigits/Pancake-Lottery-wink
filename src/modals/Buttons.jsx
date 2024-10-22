import React, { useState } from "react";
import { motion } from "framer-motion";
import { buyLottery, checkAllowance, Allowance} from "../integration";
import { analytics } from '../../firebase';
import { logEvent } from "firebase/analytics";

const Buttons = ({ switchToModal2, ticketsToBuy, lotteryID, tokenbal, totalcost, setErrorText ,setError,setIsModalOpen}) => { // Receive the function as a prop
  const [isEnabled, setIsEnabled] = useState(false);

  const handleEnableClick = async() => {

    const res = await checkAllowance();

    console.log("allowance  ",res);
    console.log("allowance in num  ",Number(res));
    console.log("allowance  in string",res.toString());

    if(Number(res) === 0){
        try {
          const ress = await Allowance();
          setIsEnabled(true);


        } catch (error) {
          console.log("error in apprioval",error)
        }
    }
    else{
      setIsEnabled(true);

    }
  };


  const handleBuy = async() => {   
    try {
      if(tokenbal < totalcost){
        setError(true)
        setErrorText("Insufficient Cake Token Balance")

        // Log purchase failure due to insufficient balance
        logEvent(analytics, 'purchase_failed', {
          reason: 'insufficient_balance',
          ticketCount: ticketsToBuy,
          totalCost: totalcost,
          failureTime: new Date().toISOString(),
        });

        return
      }
      setError(false)
      console.log("ticsj",ticketsToBuy);
      console.log("lotteryID",lotteryID);

      // Log purchase attempt
      logEvent(analytics, 'purchase_attempt', {
        ticketCount: ticketsToBuy,
        totalCost: totalcost,
        attemptTime: new Date().toISOString(),
      });

      const res = await buyLottery(lotteryID,ticketsToBuy)

      console.log("res",res);
      alert("Purchase Successful")

      // Log successful purchase
      logEvent(analytics, 'purchase_success', {
        ticketCount: ticketsToBuy,
        totalCost: totalcost,
        lotteryID: lotteryID,
        purchaseTime: new Date().toISOString(),
      });

      setIsModalOpen(false)

    } catch (error) {
      console.log("errir in buy",error);

      // Log purchase failure due to any other error
      logEvent(analytics, 'purchase_failed', {
        reason: error.message,
        ticketCount: ticketsToBuy,
        totalCost: totalcost,
        failureTime: new Date().toISOString(),
      });
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
            onClick={() => {
              logEvent(analytics, 'edit_numbers_click', {
                clickTime: new Date().toISOString(),
                ticketCount: ticketsToBuy,
              });
              switchToModal2();
            }} // Switch to Modal2 when clicked
          >
            View/Edit Numbers
          </motion.button>
        </>
      )}
    </div>
  );
};

export default Buttons;
