import { useState } from "react";
import lodash from "lodash";
import axios from "axios";
import "./App.css";

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [param, setParam] = useState("");
  const [listItem, setListItem] = useState(null);
  let cancel;

  const fetchData = lodash.debounce(async (value) => {
    setIsLoading(true);
    cancel = axios.CancelToken.source();
    try {
      const res = await axios.get(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?`,
        {
          params: { s: value },
          cancelToken: cancel.token,
        }
      );
      if (param) {
        setListItem(res.data.drinks ? res.data.drinks : []);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }, 500);

  //COMMENT: Solution2: ref & settimeout.
  // const timeout = useRef()
  // const handleDebounceSearch = value => {
  //   clearTimeout(timeout.current)
  //   timeout.current = setTimeout(() => {
  //     fetchData2(value)
  //   }, 500)
  // }
  // const fetchData2 = async(value) => {
  //   setIsLoading(true);
  //   cancel = axios.CancelToken.source()
  //   try {
  //     const res = await axios.get(
  //       `https://www.thecocktaildb.com/api/json/v1/1/search.php?`,
  //       {
  //         params: { s: value },
  //         cancelToken: cancel.token
  //       }
  //     );
  //     if(param) {
  //       setListItem(res.data.drinks ? res.data.drinks : []);
  //     }
  //     setIsLoading(false);
  //   } catch (error) {
  //     console.log(error);
  //     setIsLoading(false);
  //   }
  // }

  const handleChange = (e) => {
    setParam(e.target.value);
    if (!e.target.value) {
      fetchData.cancel();
      setListItem(null);
      setIsLoading(false);
    } else {
      fetchData(e.target.value);
      // Solution2:
      // handleDebounceSearch(e.target.value)
      setIsLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <div  className="main-container">
        <div className="heading">Autocomplete</div>
        <input placeholder="Type to search cocktails..🍸 " className="search-input" value={param} onChange={handleChange} />
        <ul className="list">
          {isLoading && <div>loading...</div>}
          {listItem &&
            param &&
            listItem.map((item, index) => {
              return (
                <li className="list-item" key={`${item.strDrink} + ${index}`}>
                  {item.strDrink}
                </li>
              );
            })}
          {listItem && listItem.length === 0 && <li>No matching items</li>}
        </ul>
      </div>
    </div>
  );
}

export default App;
