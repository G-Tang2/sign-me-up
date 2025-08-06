"use client";

import { SearchBox } from '@mapbox/search-js-react';

export default function SearchBoxWrapper({value, onChange, onRetrieve, required}) {
  const apiKey = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  
  return (
    <SearchBox
      accessToken={apiKey}
      value={value}
      onChange={onChange}
      onRetrieve={onRetrieve}
      required={required}
      options={{
        country: 'AU',
        types: ['place', 'address', "poi"],
      }}
    />
  );
}