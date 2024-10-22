import React, { useEffect, useState } from "react";
import TicketButton from "../assets/ticketbutton1.png";
import { motion } from "framer-motion";
import Modal from "../modals/Modal1.tsx"; 
import Modal2 from "../modals/Modal2.jsx"; 
import { getTokenBalance } from "../integration.js";
import { analytics } from '../../firebase';
import { logEvent } from "firebase/analytics";

const BuyBtn = ({price, discount, lotteryId,priceRaw}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [showModal2, setShowModal2] = useState(false); 
  const [ticketCount, setTicketCount] = useState(0); // Ticket count state lifted here
  const [randval, setRandval] = useState([])
  const [tokenBal, setTokenBalval] = useState('')
  const [tokenError, setTokenError] = useState(false)

const [errorText, setErrorText] = useState("")
  const cakePerTicket = 3.03;
console.log("price",price);
  // Calculate the total cost based on ticket count
  const totalCost = (ticketCount * price).toFixed(2);

  // const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleModal = () => {
    logEvent(analytics, 'buy_tickets_modal_open', {
      ticketCount: ticketCount, // Number of tickets at the time of modal open
      openTime: new Date().toISOString(),
    });
    setIsModalOpen(!isModalOpen);
  };


  const switchToModal2 = () => {
    logEvent(analytics, 'purchase_intent', {
      totalCost: totalCost,   // Total cost of tickets
      ticketCount: ticketCount,  // Number of tickets being bought
      switchTime: new Date().toISOString(),
    });
    setIsModalOpen(false); 
    setShowModal2(true); 
  };

  const switchToModal1 = () => {
    logEvent(analytics, 'modal_back_to_ticket', {
      ticketCount: ticketCount,
      totalCost: totalCost,
      switchTime: new Date().toISOString(),
    });

    setShowModal2(false); // Close Modal2
    setIsModalOpen(true); // Open Modal1
  };

  
  function generateRandomNumbers(ticketCount) {
    const result = [];
    
    for (let i = 0; i < ticketCount; i++) {
        // Generate a random 7-digit number
        const ticketNumber = Math.floor(Math.random() * 1000000) + 1000000; 
  
        result.push(ticketNumber);
    }
    
    return ticketCount === 1 ? result[0] : result;
  }



  useEffect( ()=>{
    const res =  generateRandomNumbers(ticketCount)
    setRandval(res)
  },[ticketCount])

  return (
    <div>
      {/* Background Content */}
      <div className={`relative ticket-main ${isModalOpen ? "blur-sm" : ""}`}>
        <img className="h-16 mx-auto" src={TicketButton} alt="Lottery Ticket" />
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[#492C81] to-[#7343D2] hover:from-[#492C81]/80 hover:to-[#7343D2]/80 text-xs font-bold h-10 w-44 rounded-full mx-auto my-auto"
          onClick={toggleModal} >
          Buy Tickets
        </motion.button>
      </div>

      {/* Modal1 Component */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50">
          <Modal
            isOpen={isModalOpen}
            toggleModal={toggleModal}
            switchToModal2={switchToModal2}
            ticketCount={ticketCount}
            setTicketCount={setTicketCount}
            totalCost={totalCost} 
            priceTicketInCake={price}
            discountDivisor={discount}
            lotteryId={lotteryId}
            priceRaw={priceRaw}
            setTokenBalval={setTokenBalval}
            setIsModalOpen={setIsModalOpen}
          />
        </div>
      )}

      {/* Modal2 Component */}
      {showModal2 && (
        <div className="fixed inset-0 z-50">
          <Modal2
            isOpen={showModal2}
            toggleModal={() => setShowModal2(false)} 
            switchToModal1={switchToModal1} 
            totalCost={totalCost}
            ticketCount={ticketCount}
            randnum={randval}
            setrandval ={setRandval}
            lotteryId={lotteryId}
            setIsModalOpen={setIsModalOpen}
      tokenbal={tokenBal} totalcost={totalCost} setErrorText={setErrorText} setError={setTokenError}
      errorText={errorText}
error={tokenError}

          />
        </div>
      )}
    </div>
  );
};

export default BuyBtn;