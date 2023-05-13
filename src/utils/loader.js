import { ThreeDots } from 'react-loader-spinner'

const Loader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5'
      }}
    >
      <ThreeDots
        height='80'
        width='80'
        radius='9'
        color='#4fa94d'
        ariaLabel='three-dots-loading'
        wrapperStyle={{  }}
        wrapperClassName=''
        visible={true}
      />
    </div>
  )
}

export default Loader
