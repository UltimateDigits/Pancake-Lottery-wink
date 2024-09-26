import React, { useState } from "react";
import { motion } from "framer-motion";

import { buyLottery } from "../integration";

const Modal2 = ({ isOpen, toggleModal, totalCost, switchToModal1     ,    ticketCount , randnum,setrandval,lotteryId
}) => {
  // State to hold the 6 random numbers
  const [randomNumbers, setRandomNumbers] = useState([1, 2, 3, 4, 5, 6]);

  // Function to generate 6 random numbers between 0 and 9
  const handleRandomize = () => {
  const res =   generateRandomNumbers(ticketCount);

  setrandval(res)
    setRandomNumbers(newNumbers); // Update the state with new random numbers
  };

  console.log("randnum",randnum);
  console.log(ticketCount,"ticketCount");


  function generateRandomNumbers(ticketCount) {
    const result = [];
    
    for (let i = 0; i < ticketCount; i++) {
        // Generate a random 7-digit number
        const ticketNumber = Math.floor(Math.random() * 1000000) + 1000000; 
  
        result.push(ticketNumber);
    }
    
    return ticketCount === 1 ? result[0] : result;
  }


  const handleBuy = async()=>{
    try {

      console.log("ticsj",ticketCount);
      console.log("lotteryID",lotteryId);
      const res = await buyLottery(lotteryId,randnum)

      console.log("res",res);
    } catch (error) {
      console.log("errir in buy",error);
    }
  }

  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-[#27262C] h-fit rounded-xl shadow-lg mt-2 w-[350px]">
          <div className="bg-[#3B384D] flex justify-between p-2 px-6 rounded-t-xl">
            <p className="font-bold">Edit Numbers</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-[#1FC7D4] cursor-pointer"
              onClick={toggleModal} // Close modal on click
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>

          <div className="p-4 px-6 space-y-3">
            <div className="flex justify-between items-center">
              <p className=" text-[#B3A9CD] font-semibold">Total Cost:</p>
              <p className="font-bold">~{totalCost} CAKE</p>{" "}
              {/* Display total cost */}
            </div>
            <p className=" text-xs text-[#B3A9CD] font-semibold">
              Numbers are randomized with no duplicates among your tickets. Tap
              a number to edit it. <br />
              Available digits: 0-9
            </p>

            <motion.button
              whileTap={{ scale: 0.9 }}
              className="border-2 border-[#1FC7D4] hover:border-[#1FC7D4]/80 text-[#1FC7D4] hover:text-[#1FC7D4]/80 transition-colors duration-200 p-2 w-full rounded-full font-bold"
              onClick={handleRandomize} // Call the randomize function on click
            >
              Randomize
            </motion.button>

            <div className=" font-semibold">
       
            
                {/* Display the random numbers */}
                {randnum.map((number, index) => (
                  <>                         <p>#00{index+1}</p>
                    <p className="bg-[#3B384D] rounded-lg flex justify-between p-2 px-4">
                      
  <span key={index}>
    {/* Convert the number to a string, split into individual digits, and map over each digit */}
    {number.toString().split('').map((digit, digitIndex) => (
      <span className="px-3" key={digitIndex}>{digit}</span>
    ))}
  </span>
  </p>
  </>

))}
          
            </div>
            <motion.button
              className="bg-[#1FC7D4] hover:bg-[#1FC7D4]/50 transition-colors duration-200 p-2 w-full rounded-xl text-black font-bold"
              whileTap={{ scale: 0.9 }} onClick={handleBuy}
            >
              Confirm and Buy
            </motion.button>
            <motion.button
              className="border-2 border-[#1FC7D4] hover:border-[#1FC7D4]/80 text-[#1FC7D4] hover:text-[#1FC7D4]/80 transition-colors duration-200 p-2 w-full rounded-xl font-bold flex justify-center items-center gap-1"
              whileTap={{ scale: 0.9 }}
              onClick={switchToModal1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
              Go Back
            </motion.button>
          </div>
        </div>
      </div>
    )
  );
};

export default Modal2;
