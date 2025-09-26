const testimonials = [
  {
    id: 1,
    name: 'Sarah Wilson',
    treatment: 'Botox',
    quote: 'I felt so comfortable and confident during my Botox session. The results were amazing!',
    beforeImage: 'https://example.com/before1.jpg',
    afterImage: 'https://example.com/after1.jpg',
  },
  {
    id: 2,
    name: 'John Davis',
    treatment: 'Hair Restoration',
    quote: 'The hair restoration treatment changed my life! I finally feel confident again.',
    beforeImage: 'https://example.com/before2.jpg',
    afterImage: 'https://example.com/after2.jpg',
  },
]

export default function Testimonials() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900">Client Testimonials</h2>
        <p className="mt-4 text-lg text-gray-500">
          See the amazing transformations and hear what our clients have to say about their experience.
        </p>

        <div className="mt-12 space-y-16">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="lg:grid lg:grid-cols-2 lg:gap-8">
              <div className="relative lg:col-start-2">
                <blockquote className="mt-2">
                  <p className="text-xl font-medium text-gray-900">"{testimonial.quote}"</p>
                  <footer className="mt-4">
                    <p className="text-base font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-base text-gray-500">{testimonial.treatment}</p>
                  </footer>
                </blockquote>
              </div>
              <div className="mt-10 lg:col-start-1 lg:row-start-1 lg:mt-0">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Before</p>
                    <img
                      src={testimonial.beforeImage}
                      alt={`Before ${testimonial.treatment}`}
                      className="mt-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">After</p>
                    <img
                      src={testimonial.afterImage}
                      alt={`After ${testimonial.treatment}`}
                      className="mt-2 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}