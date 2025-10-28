import Button from '@/components/Button'

export default function NewsletterSection (): React.ReactNode {
  return (
    <section id='newsletter' className='py-20 bg-cape-palliser-50'>
      <div className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
        <h2 className='text-3xl font-bold text-cape-palliser-900 mb-4'>
          Restez informé
        </h2>
        <p className='text-cape-palliser-600 mb-8'>
          Inscrivez-vous à notre newsletter et recevez 10% de réduction sur votre premier achat in-app !
        </p>
        <form className='flex flex-col sm:flex-row gap-4 justify-center'>
          <input
            type='email'
            placeholder='Votre email'
            className='px-4 py-3 rounded-lg border border-cape-palliser-200 focus:outline-none focus:ring-2 focus:ring-cape-palliser-500 flex-grow max-w-md'
          />
          <Button
            variant='primary'
            size='lg'
          >
            S&apos;inscrire
          </Button>
        </form>
      </div>
    </section>
  )
}
