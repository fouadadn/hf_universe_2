import Footer from '@/app/components/Home/footer';
import api from '@/app/utils/axiosInstance';
import Link from 'next/link';
import React from 'react'
import Image from 'next/image';

const monthsWithIndex = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December"
};

function slugify(str) {
  return String(str)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const getUpcomingMovies = async () => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth() + 1;

  const fetchNetflixMovies = async (totalPages = 4) => {
    const requests = [];
    for (let i = 1; i <= totalPages; i++) {
      requests.push(
        api.get("/movie/upcoming", { params: { page: i } })
      );
    }
    const responses = await Promise.all(requests);
    return responses.flatMap(res => res.data.results);
  };

  const upcomingMovies = await fetchNetflixMovies();

  const filterByMonth = (month, data) => {
    return data.filter((movie) => {
      const releaseDate = new Date(movie.release_date);
      return (
        releaseDate.getMonth() + 1 === month &&
        releaseDate.getFullYear() === currentYear
      );
    }).filter((movie, index, self) =>
      index === self.findIndex((m) => m.id === movie.id)
    ).sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
  };

  const thisMonth = filterByMonth(currentMonth, upcomingMovies);
  const nextMonth = filterByMonth(currentMonth + 1, upcomingMovies);
  const nextTwoMonth = filterByMonth(currentMonth + 2, upcomingMovies);

  return { thisMonth, nextMonth, nextTwoMonth, currentMonth };
};

export async function generateMetadata() {
  const { thisMonth, nextMonth, currentMonth } = await getUpcomingMovies();
  const moviesForTitle = [...thisMonth, ...nextMonth].slice(0, 3).map(m => m.title).join(', ');

  const title = `Upcoming Movie Releases for ${monthsWithIndex[currentMonth]} & ${monthsWithIndex[currentMonth + 1]} | HF Universe`;
  const description = `Stay up-to-date with the latest movie release schedule. Upcoming movies include: ${moviesForTitle}. Find out when new movies are coming to theaters on HF Universe.`;

  return {
    title,
    description,
    keywords: ["movie releases", "upcoming movies", "release schedule", "new movies", "HF Universe", monthsWithIndex[currentMonth], monthsWithIndex[currentMonth + 1]],
    openGraph: {
      title,
      description,
      type: 'website',
      url: '/movierelease',
    },
  };
}

const MovieReleasePage = async () => {
  const { thisMonth, nextMonth, nextTwoMonth, currentMonth } = await getUpcomingMovies();

  const allMovies = [...thisMonth, ...nextMonth, ...nextTwoMonth];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': 'Upcoming Movie Release Schedule',
    'description': 'A list of upcoming movie releases.',
    'itemListElement': allMovies.map((movie, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'item': {
        '@type': 'Movie',
        'name': movie.title,
        'url': `/movie/${slugify(movie.title)}/${movie.id}`,
        'image': `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        'dateCreated': movie.release_date,
        'description': movie.overview,
        ...(movie.vote_average && {
          'aggregateRating': {
            '@type': 'AggregateRating',
            'ratingValue': movie.vote_average,
            'bestRating': '10',
            'ratingCount': movie.vote_count,
          }
        })
      }
    })),
  };

  return (
    <div className='w-full'>
      <div className='mb-10 '>
        <div className='relative -top-1 h-[50vh] md:h-[90vh] overflow-hidden'>
          <Image src="/assets/upcoming.jpg" alt="Upcoming movie releases banner" className='w-full object-cover' width={1920} height={1080} priority />
          <div className='bg-gradient-to-t from-black to-transparent flex  items-end bg-[linear-gradient(to_top,black_15%,transparent_80%)] absolute top-0 bottom-0  right-0 left-0'>
            <div className='relative bottom-12 px-4 '>
              <h1 className="text-2xl md:text-4xl font-bold mb-2 text-white max-w-[450px] ">Schedule Release Of All Movies Around The World</h1>
              <p className="text-gray-500 ">
                Stay up to date with the hottest upcoming movie releases.
              </p>
            </div>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className='mx-4  font-bold text-2xl'>
          <h2>UPCOMING RELEASE</h2>
        </div>

        <div className='mt-12 mx-4'>
          <h3 className='font-bold text-2xl mb-2'>{monthsWithIndex[currentMonth]}</h3>
          <hr className=' ' style={{ borderColor: '#ffffff30' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 mt-4">
            {
              thisMonth.length > 0 ? thisMonth.map((movie) => (
                <Link
                  href={`/movie/${slugify(movie.title)}/${movie?.id}`}
                  key={movie.id} className=" text-white rounded-lg p-2 shadow-md justify-items-start flex items-center gap-2">
                  <div className='bg-white h-12 w-12 rounded-full flex items-center justify-center'>
                    <span className='text-black text-2xl font-bold'>{String(movie.release_date)?.split('-')[2]}</span>
                  </div>
                  <div className='w-14 h-16 overflow-hidden rounded-2xl'>
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      width={56}
                      height={84}
                      className="w-14 h-auto relative bottom-2"
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
                    <p className="text-sm text-gray-400" style={{ color: "#99a1af" }}>Release: {movie.release_date}</p>
                  </div>
                </Link>
              ))
                : Array.from({ length: 8 }).map((_, i) => <div key={i} className='flex gap-3 items-center animate-pulse'>
                  <div className='w-14 h-14 rounded-full gri'>

                  </div>
                  <div className='w-14 h-16 rounded-2xl gri'>

                  </div>

                  <div className='flex flex-col gap-1'>
                    <span className='w-44 h-3 rounded gri block'></span>
                    <span className='w-32 h-3 rounded gri block'></span>
                  </div>
                </div>
                )
            }
          </div>

        </div>

        <div className='mt-12 mx-4'>
          <h3 className='font-bold text-2xl mb-2'>{monthsWithIndex[currentMonth + 1]}</h3>
          <hr className=' ' style={{ borderColor: '#ffffff30' }} />
          <div className="grid grid-cols-1 sm:grid-cols-2  gap-6 mt-4">
            {
              nextMonth.length > 0 ? nextMonth.map((movie) => (
                <Link
                  href={`/movie/${slugify(movie.title)}/${movie?.id}`}
                  key={movie.id} className=" text-white rounded-lg p-2 shadow-md justify-items-start flex items-center gap-2 ">
                  <div className='bg-white h-12 w-12 rounded-full flex items-center justify-center shrink-0'>
                    <span className='text-black text-2xl font-bold'>{String(movie.release_date)?.split('-')[2]}</span>
                  </div>
                  <div className='w-14 h-16 rounded-2xl overflow-hidden'>
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      width={56}
                      height={84}
                      className="w-14 h-auto relative bottom-2 "
                    />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mt-2">{movie.title}</h2>
                    <p className="text-sm text-gray-400" style={{ color: "#99a1af" }}>Release: {movie.release_date}</p>
                  </div>
                </Link>
              )) : Array.from({ length: 8 }).map((_, i) => <div key={i} className='flex gap-3 items-center animate-pulse'>
                <div className='h-14 w-14 rounded-full gri'>

                </div>
                <div className='w-14 h-16 rounded-2xl gri'>

                </div>

                <div className='flex flex-col gap-1'>
                  <span className='w-44 h-3 rounded gri block'></span>
                  <span className='w-32 h-3 rounded gri block'></span>
                </div>
              </div>
              )
            }
          </div>
        </div>
      </div>
      <hr style={{ borderColor: "#ffffff30" }} className='mt-16' />
      <Footer />
    </div>
  )
}

export default MovieReleasePage
