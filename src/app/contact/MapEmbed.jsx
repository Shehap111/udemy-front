// components/MapEmbed.js
"use client";
import React from "react";

const MapEmbed = () => {
  return (
    <div style={{ width: "100%", height: "450px", marginTop: "40px" }}>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29446.421703823176!2d31.14259050382789!3d29.978873455584726!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14584f7de239bbcd%3A0xca7474355a6e368b!2z2KPZh9ix2KfZhdin2Kog2KfZhNis2YrYstip!5e0!3m2!1sar!2seg!4v1747151753421!5m2!1sar!2seg"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
};

export default MapEmbed;
