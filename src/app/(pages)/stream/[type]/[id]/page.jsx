import React from 'react'
import Stream from '@/app/components/stream/stream'

const page = async ({ params }) => {

    const { id } = await params;
    const { type } = await params;

    return (
        <div>
            <Stream id={id} type={type} />
        
            
        </div>
    )
}

export default page 
