import React from 'react'
import DiscoverDetails from '@/app/components/discoverDetails/DiscoverDetails'

const Discover = async ({ params }) => {
    const { provider } = await params
    const { id } = await params
    return (
        <div>
            <DiscoverDetails provider={provider} p_id={id} />
        </div>
    )
}
 
export default Discover
