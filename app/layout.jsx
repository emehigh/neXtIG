import '@styles/globals.css'
import Nav from '@components/Nav';
import Provider from '@components/Provider';


export const metadata = {
    title : "Next Instagram",
    description : "Find your friends"
}

const RootLayout = ({children}) => {
  return (
    <html lang="en" >
        <body className=''>
            <Provider>
              <div className='main'>
                <div className=''/>
              </div>

              <main className='app'>
                {children}
                <Nav/>

              </main>
            </Provider>
        </body>
    </html>
  )
}

export default RootLayout