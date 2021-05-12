class Fetch {
    async getCurrent(input) {
      const myKey = "b519d2c06a73026221ff5fabe57f62c1";
  
      //request to url
  
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${input}&units=metric&appid=${myKey}`
      )
      const data = await response.json();
  
      return data;
      
    }
  }