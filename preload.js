const axios = require('axios');
const apiKey = '**APIKEY**';

const lifxApi = axios.create({
    baseURL: 'https://api.lifx.com/v1/',
    headers: {
      'Authorization': `Bearer ${apiKey}`
    }
  });
  
  window.lifx = {
    getLights: async () => {
      try {
        const response = await lifxApi.get('/lights/all');
        const lights = response.data;
  
        // Log the raw lights data
        console.log('Raw lights data:', lights);
  
        // Group lights by group name
        const groupedLights = lights.reduce((acc, light) => {
          const groupName = light.group ? light.group.name : 'Unknown';
          if (!acc[groupName]) {
            acc[groupName] = [];
          }
          acc[groupName].push(light);
          return acc;
        }, {});
  
        // Log the grouped structure
        console.log('Grouped lights:', groupedLights);
  
        return groupedLights;
      } catch (error) {
        console.error('Error fetching lights:', error);
        return {};
      }
    },
    setPower: async (lightId, power) => {
      try {
        await lifxApi.put(`/lights/id:${lightId}/state`, { power });
      } catch (error) {
        console.error(`Error setting power ${power} for light ${lightId}:`, error);
      }
    },
    setBrightness: async (lightId, brightness) => {
      try {
        await lifxApi.put(`/lights/id:${lightId}/state`, { brightness: brightness / 100 });
      } catch (error) {
        console.error(`Error setting brightness ${brightness} for light ${lightId}:`, error);
      }
    },
    setColor: async (lightId, color) => {
      try {
        const formattedColor = `kelvin:${color.kelvin}`;
        console.log(`Setting color for light ${lightId}:`, formattedColor);
        const response = await lifxApi.put(`/lights/id:${lightId}/state`, {
          color: formattedColor,
          kelvin: color.kelvin
        });
        console.log('Color set response:', response.data);
      } catch (error) {
        console.error('Error setting color:', error.response ? error.response.data : error.message);
      }
    }
  };