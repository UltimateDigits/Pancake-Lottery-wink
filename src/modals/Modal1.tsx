import React, { useState , useCallback } from "react";
import TicketLeft from "../assets/ticket-r.png";
import { motion } from "framer-motion";
import Buttons from "./Buttons";
import BigNumber from 'bignumber.js'
import { useEffect } from "react";
import memoize from 'lodash/memoize'
import _trimEnd from 'lodash/trimEnd'
import { getTokenBalance } from "../integration";

 const BIG_TEN = new BigNumber(10)
 const BIG_ZERO = new BigNumber(0)

const Modal = ({ isOpen, toggleModal, switchToModal2, ticketCount, setTicketCount, totalCost, priceTicketInCake, discountDivisor, lotteryId ,priceRaw,setTokenBalval }) => {
  const [showTooltip, setShowTooltip] = useState(false); // State to show/hide tooltip
  const [discountValue, setDiscountValue] = useState('')
  const [totalCostv, setTotalCost] = useState('')

const [randval, setRandval] = useState([])
const [tokenBal, setTokenBal] = useState('')
const [tokenError, setTokenError] = useState(false)

const [errorText, setErrorText] = useState("")
  const cakePerTicket = 3.03;

  const handleTicketChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && value >= 0) {
      setTicketCount(value);
    }
  };

  const getFullDecimalMultiplier = memoize((decimals: number): BigNumber => {
    return BIG_TEN.pow(decimals)
  })
  
   const getBalanceAmount = (amount: BigNumber, decimals: number | undefined = 18) => {
    return amount.dividedBy(getFullDecimalMultiplier(decimals))
  }
  
  /**
   * This function is not really necessary but is used throughout the site.
   */
   const getBalanceNumber = (balance: BigNumber | undefined, decimals = 18) => {
    return getBalanceAmount(balance || BIG_ZERO, decimals).toNumber()
  }
  
   const getFullDisplayBalance = (balance: BigNumber, decimals = 18, displayDecimals?: number): string => {
    const stringNumber = getBalanceAmount(balance, decimals).toFixed(displayDecimals as number)
  
    return displayDecimals ? _trimEnd(_trimEnd(stringNumber, '0'), '.') : stringNumber
  }
  const getTicketCostAfterDiscount = useCallback(
    (ticketCount: BigNumber) => {

      console.log("tic count", ticketCount);
      
      const numberOfTicketsToBuy = new BigNumber(ticketCount)

      console.log("numberOfTicketsToBuy",numberOfTicketsToBuy);
      

      console.log("priceTicketInCake",priceRaw);

      console.log("discountDivisor",BigNumber(discountDivisor.toString()));
      const disc = BigNumber(discountDivisor.toString())

      const priceInBN = new BigNumber(priceRaw)

      console.log("priceBn", priceInBN);
      
      const totalAfterDiscount = priceInBN
        .times(numberOfTicketsToBuy)
        .times(new BigNumber(disc).plus(1).minus(numberOfTicketsToBuy))
        .div(disc)

        console.log("tad",totalAfterDiscount);

        console.log("tad in num =", Number(totalAfterDiscount));
        
        
      return totalAfterDiscount
    },
    [discountDivisor, priceTicketInCake],
  )
  const costAfterDiscount = getTicketCostAfterDiscount(ticketCount)

console.log("cosg",costAfterDiscount);

function generateRandomNumbers(ticketCount) {
  const result = [];
  
  for (let i = 0; i < ticketCount; i++) {
      // Generate a random 7-digit number
      const ticketNumber = Math.floor(Math.random() * 1000000) + 1000000; 

      result.push(ticketNumber);
  }
  
  return ticketCount === 1 ? result[0] : result;
}

useEffect(()=>{

  console.log("ticjket",ticketCount);
  getBal()
  const costAfterDiscount = getTicketCostAfterDiscount(ticketCount )
const numberOfTicketsToBuy = new BigNumber(ticketCount)
const priceinBN = new BigNumber(priceRaw)
  const costBeforeDiscount = priceinBN.times(numberOfTicketsToBuy)
  const discountBeingApplied = costBeforeDiscount.minus(costAfterDiscount)
  setDiscountValue(discountBeingApplied.gt(0) ? getFullDisplayBalance(discountBeingApplied, 18, 5) : '0')
  setTotalCost(costAfterDiscount.gt(0) ? getFullDisplayBalance(costAfterDiscount, 18, 2) : '0')

 const res =  generateRandomNumbers(ticketCount)
setRandval(res)

},[ticketCount])

const getTicketCostAfterDiscountprice = useCallback(
  (ticketCount: BigNumber, pricePerTicket: BigNumber, discountDivisor: BigNumber) => {

    console.log("No of tickets:", ticketCount.toString());
    console.log("Discount Divisor:", discountDivisor.toString());

    // Calculate total cost before discount
    const totalCost = BigNumber(ticketCount).multipliedBy(pricePerTicket);
    console.log("totalcoass", totalCost);
    
    // Calculate discount
    const discountAmount = totalCost.dividedBy(discountDivisor);
    console.log("discout",discountAmount);
    
    // Total cost after discount
    const totalAfterDiscount = totalCost.minus(discountAmount);

    console.log("Total Cost After Discount:", totalAfterDiscount.toString());
    return totalAfterDiscount;
  },
  [] // Dependencies array, add relevant dependencies if necessary
);


const getBal = async()=>{
  try {
    const bal = await  getTokenBalance();
console.log("bal",bal);

const instring = bal.toString()
const inBig = new BigNumber(instring)
const res = getFullDisplayBalance(inBig, 18, 3)



console.log("res of bal",res);

setTokenBal(res)
setTokenBalval(res)

  } catch (error) {
    console.log("issue in getting balance",error);
    
  }
}



  return (
    isOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div className="bg-[#27262C] h-fit rounded-xl shadow-lg mt-2 w-[350px]">
          <div className="bg-[#3B384D] flex justify-between p-2 px-6 rounded-t-xl">
            <p className="font-bold">Buy Tickets</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-[#1FC7D4] cursor-pointer"
              onClick={toggleModal} // Close Modal1
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
              <p className=" text-[#B3A9CD] font-semibold">Buy:</p>
              <p className=" flex items-center font-bold">
                Tickets{" "}
                <img className=" h-6 ml-2" src={TicketLeft} alt="Ticket Icon" />
              </p>
            </div>
            <div className="">
              <div className="bg-[#3B384D] rounded-xl h-fit p-3">
                <input
                  className=" w-full h-10 bg-transparent text-right font-bold focus:outline-none focus:ring-0"
                  placeholder="0"
                  type="text"
                  value={ticketCount}
                  onChange={handleTicketChange}
                />
                <p className="text-[#B3A9CD] text-right font-bold text-xs">
                  ~{totalCost} CAKE
                </p>
              </div>
              <p className=" text-right text-xs pt-1 text-[#B3A9CD]">
                CAKE balance:{tokenBal}
              </p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="bg-[#3B384D] hover:bg-[#3B384D]/60 w-full text-[#1FC7D4] font-semibold rounded-full"
            >
              MAX
            </motion.button>
            <div className="text-[#B3A9CD] text-sm font-medium">
              <div className="flex justify-between items-center text-[#B3A9CD]">
                <p>Cost (CAKE)</p>
                <p>{totalCost} CAKE</p>
              </div>
              <div className="flex justify-between items-center text-[#B3A9CD] relative">
                <p className=" text-white flex items-center">
                  0%
                  <span
                    className="text-[#B3A9CD] flex items-center pl-1 relative"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  >
                    Bulk discount
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-5 ml-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                      />
                    </svg>

                    {/* Tooltip */}
                    {showTooltip && (
                      <div className="absolute bg-white text-black text-xs rounded-lg p-2  bottom-6 w-[300px] shadow-lg">
                        <p>Buying multiple tickets in a single transaction gives a discount. The discount increases in a linear way, up to the maximum of 100 tickets:</p>
                        <ul className="list-disc ml-4 mt-1">
                          <li>2 tickets: 0.05%</li>
                          <li>50 tickets: 2.45%</li>
                          <li>100 tickets: 4.95%</li>
                        </ul>
                      </div>
                    )}
                  </span>
                </p>
                <p>~{discountValue} CAKE</p>
              </div>
            </div>
            <div className="border border-[#B3A9CD]/10"></div>
            <div className="flex justify-between items-center text-[#B3A9CD] font-semibold">
              <p className=" ">You pay</p>
              <p className="text-white">~{totalCostv} CAKE</p>
            </div>
           {tokenError &&  <div className="text-red-500">{errorText}</div>}
            <Buttons switchToModal2={switchToModal2} ticketsToBuy={randval} lotteryID={lotteryId} tokenbal={tokenBal} totalcost={totalCost} setErrorText={setErrorText} setError={setTokenError} />
          </div>
        </div>
      </div>
    )
  );
};

export default Modal;
