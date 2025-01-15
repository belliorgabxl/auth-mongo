import React from 'react';
import FormPage from './formPage';

export default async function page({ params }: { params: { deviceId: string }}) {
  const paramId = params.deviceId; 
  return (
    <div>
      <FormPage device_id={paramId} />
    </div>
  );
}
