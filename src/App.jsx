import { useEffect, useState } from "react"
import { IoMdSwap } from "react-icons/io";
import useFetchCurrencyData from "./hooks/useFetchCurrencyData"
import Flag from 'react-world-flags'

function App() {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);

  const { data, error, lastUpdate, currencyToCountryCode } = useFetchCurrencyData(fromCurrency);
  const timeStamp = lastUpdate
  const date = new Date(timeStamp * 1000)
  const fullDate = date.toLocaleString();

  useEffect(() => {
    if (data) {
      setExchangeRate(data.rates[toCurrency]);
    }
  }, [data, toCurrency]);

  useEffect(() => {
    if (exchangeRate !== null) {
      setConvertedAmount((amount * exchangeRate).toFixed(2));
    }
  }, [amount, exchangeRate]);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const handleFromCurrencyChange = (event) => {
    console.log(event.target.value);
    setFromCurrency(event.target.value);
  };

  const handleToCurrencyChange = (event) => {
    setToCurrency(event.target.value);
  };

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div className="w-full h-auto lg:h-screen bg-[#2b2e44] md:px-28 md:pt-16 md:pb-10 px-6 pt-6 pb-6">
      <h1 className="text-4xl font-bold capitalize text-[#01dac1] mb-2">Exchange Currency Widget</h1>
      <p className="text-xl font-light text-gray-300">Real-time widget for currency exchange</p>
      <div className="bg-[#2e3247] md:px-12 px-5 py-5 w-full mt-10 rounded-lg shadow-md shadow-gray-800">
        {lastUpdate && (
          <p className="text-gray-500 mb-4">Last updated: {fullDate}</p>
        )}
        <div className="currency flex md:gap-8 gap-5 items-center  md:flex-row flex-col">
          <div className="from">
            <h3 className="text-xl font-semibold text-gray-200">I have</h3>
            <div className="flex gap-1 items-center custom-select">
              {currencyToCountryCode && (
                <Flag code={currencyToCountryCode[fromCurrency]} className="mr-2 h-10 mt-[5px]" />
              )}
              <select
                value={fromCurrency}
                onChange={handleFromCurrencyChange}
                className="mt-4 mb-3 outline-none"
              >
                
                {data && Object.keys(data.rates).map(currency => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <textarea
                value={amount}
                onChange={handleAmountChange}
                className="h-28 md:w-[468px] w-full p-3 text-4xl border border-[#01dac1] outline-none bg-transparent rounded-md resize-none text-gray-300 font-semibold"
              />
            </div>
          </div>
          <div className="md:mt-20 mt-0">
            <button
              onClick={() => {
                setFromCurrency(toCurrency);
                setToCurrency(fromCurrency);
              }}
              className="bg-[#2fcab8] text-white p-2 rounded text-2xl"
            >
              <IoMdSwap className="md:rotate-0 rotate-90" />
            </button>
          </div>
          <div className="to">
            <h3 className="text-xl font-semibold text-gray-200">I want to buy</h3>
            <div className="flex gap-1 items-center">
              {currencyToCountryCode && (
                <Flag code={currencyToCountryCode[toCurrency]} className="mr-2 h-10 mt-[5px]" />
              )}
              <select
                value={toCurrency}
                onChange={handleToCurrencyChange}
                className="mt-4 mb-3 outline-none"
              >
                {data && Object.keys(data.rates).map(currency => (
                  <option key={currency} value={currency}>
                    {currency}</option>
                ))}
              </select>
            </div>

            <div>
              <textarea
                value={convertedAmount || ""}
                readOnly
                className="h-28 md:w-[468px] w-full p-3 text-4xl border border-[#01dac1] outline-none bg-transparent rounded-md resize-none text-gray-300 font-semibold"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
