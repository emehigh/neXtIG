import Feed from '@components/Feed';

const Home = () => {
  return (
    <section className="w-full flex-center flex-col">
      <h1 className="text-6xl font-bold head_text">Welcome to Next Instagram
        <br className="max-md:hidden"/>
        <span className="orange_gradient text-center">
          <h1>Find your friends</h1>
        </span>
      </h1>
      <Feed/>
    </section>
    )
}

export default Home