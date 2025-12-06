// worldtimeapi helper - calls worldtimeapi.org API
// Exposes: window.worldTimeApiConvert({ fromTimeZone, toTimeZone, dateTime })
(function () {
  const BASE = 'https://worldtimeapi.org/api/timezone';

  async function convert({ fromTimeZone, toTimeZone, dateTime }) {
    // dateTime: ISO string (e.g., '2025-12-06T15:00:00')
    // Get current time data for both timezones
    try {
      // Fetch data for the source timezone
      const fromResp = await fetch(`${BASE}/${encodeURIComponent(fromTimeZone || 'UTC')}`, {
        method: 'GET'
      });

      if (!fromResp.ok) {
        console.warn('worldtimeapi: source timezone fetch failed', fromResp.status);
        return null;
      }

      const fromData = await fromResp.json();

      // Fetch data for the target timezone
      const toResp = await fetch(`${BASE}/${encodeURIComponent(toTimeZone)}`, {
        method: 'GET'
      });

      if (!toResp.ok) {
        console.warn('worldtimeapi: target timezone fetch failed', toResp.status);
        return null;
      }

      const toData = await toResp.json();

      // Return both responses so caller can compute the time difference
      return {
        fromTimezone: fromData,
        toTimezone: toData,
        dateTime: dateTime
      };
    } catch (err) {
      console.warn('worldtimeapi: request failed', err);
      return null;
    }
  }

  // Expose helper
  window.worldTimeApiConvert = convert;
})();
