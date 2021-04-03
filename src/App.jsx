import React, { useState, useEffect } from 'react';
import {LineChart, Line, AreaChart, Area, Brush, XAxis, YAxis, Tooltip, Legend} from "recharts";
import moment from 'moment';

function App() {
  const orange = '#e67e22';
  const red = '#e74c3c';
  const green = '#27ae60';
  const darkgrey = "#363636";


  let [data, setData] = useState([]);
  let [type, setType] = useState("Active");
  let [color, setColor] = useState(orange);
  let [activeIndex, setActive] = useState(0);

  let country;

  useEffect(() => {
    fetchData();
  }, [])

  const fetchData = () => {
    fetch(`https://api.covid19api.com/total/country/Mexico`)
      .then(response => response.json())
      .then(json => setData(json))
  }





  
  data = data.filter(a => (a.Active !== 0));

  const amount_Active = data.map((a) => a.Active);
  let latest_Active = Math.max(...amount_Active);

  const amount_deaths = data.map((a) => a.Deaths);
  let latest_deaths = Math.max(...amount_deaths);

  const amount_recovered = data.map((a) => a.Recovered);
  let latest_recovered = Math.max(...amount_recovered);

  const amount_confirmed = data.map((a) => a.Confirmed);
  let latest_confirmed = Math.max(...amount_confirmed);

  const getCountries = data.map((a) => a.Country);
  country = getCountries.slice(0, 1);

  const BUTTONS = [
    {
      name: "Active",
      color: orange,
      value: latest_Active,
      percentage: 100 * latest_Active / latest_confirmed,
      id: 1
    },
    {
      name: "Deaths",
      color: red,
      value: latest_deaths,
      percentage: 100 * latest_deaths / latest_confirmed,
      id: 2
    },
    {
      name: "Recovered",
      color: green,
      value: latest_recovered,
      percentage: 100 * latest_recovered / latest_confirmed,
      id: 3
    },
  ]

  const CustomTooltip = ({ active, payload, label, textTooltip }) => {
    const dateTip = moment(label)
      .format("llll")
      .slice(0, 17);
    const formattedDate = dateTip
    if (payload === null) return
    if (active)
      return (
      <div className="custom-tooltip">
        <p className="label-tooltip">{`${formattedDate}`}</p>
        <p className="desc-tooltip">
      <span className="value-tooltip">Total Cases: {payload[0].value.toLocaleString()}</span>
        </p>
      </div>
      );
    return null;
  };

  const CustomizedAxisTick = ({ x, y, payload }) => {
    const dateTip = moment(payload.value)
      .format("ll")
      .slice(0, 12);
      return (
        <g transform={`translate(${x},${y})`}>
          <text x={23} y={0} dy={14} fontSize="0.90em" fontFamily="bold" textAnchor="end" fill="#363636">
            {dateTip}
          </text>
        </g>
      );
  }

  const xAxisTickFormatter = (timestamp_measured) => {
    return moment(timestamp_measured)
      .format("ll")
      .slice(0, 12);
  }


  // Added to filter out zero values form the API
  data = data.filter(a => (a.Active !== 0 && a.Recovered !== 0 & a.Deaths !== 0 ));

  console.log(data);

  return (
    <div className="dashboard">
      <h1 className="title is-3">{country} Covid-19 cases</h1>
      <div className="columns dashboard__numbers">
        {BUTTONS.map((item, index) =>
          <div className="column" key={index} >
            <h2>
            <button style={{ color: item.color === color ? color : "#000" }} onClick={() => [+(item.name), setActive(index),
            setColor(item.color)]} className={activeIndex === index ? 'column__button title is-3 selected' : 'column__button title is-3'}>
              {item.name}
            </button>
            </h2>
            <p className="subtitle is-4" >{item.value.toLocaleString()}</p>
          </div>
        )}
      </div>
      <div className="columns">
        <LineChart width={800} height={400} data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="Date" tick={CustomizedAxisTick}/>
          <YAxis />
          <Tooltip content={<CustomTooltip />} animationDuration={0} />
          <Legend />
          <Line type="monotone" dataKey={type} stroke="#e67e22" fill="#e67e22" dot=""/>
          <Brush tickFormatter={xAxisTickFormatter} dataKey="Date" startIndex={Math.round(data.length * 0.80)} >
            <AreaChart>
              <Area type="monotone" dataKey={type} fill={color} stroke={color}/>
            </AreaChart>
          </Brush>
        </LineChart>
      </div>
    </div>
  );
}

export default App;
