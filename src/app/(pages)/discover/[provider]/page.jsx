import React from 'react'
import DiscoverDetails from '@/app/components/discoverDetails/DiscoverDetails'

const Discover = async ({ params }) => {
    const { provider } = await params
    return (
        <div>
            <DiscoverDetails provider={provider} />
        </div>
    )
}

export default Discover
