import React from 'react'
import Stream from '@/app/components/stream/stream'

const page = async ({ params }) => {
    const paramsArr = (await params).params


    const type = paramsArr[0] || null;
    const id = paramsArr[2] || null;
    const season = paramsArr[3] || null
    const episode = paramsArr[4] || null



    return (
        <div>
            <Stream id={id} type={type} season={season} episode={episode} lengthParams={paramsArr?.length} />
        </div>
    )
}

export default page


