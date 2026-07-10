export default function Footer() {
  return (
    <footer className="bg-black shadow mt-8 border-t border-[#f7cf1d]">
      <div className="container mx-auto px-4 py-6 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} DeVote. All rights reserved.</p>
        <p className="mt-2">
          <a href="/privacy" className="hover:text-[#f7cf1d]">Privacy Policy</a>
          {' | '}
          <a href="/terms" className="hover:text-[#f7cf1d]">Terms of Service</a>
        </p>
      </div>
    </footer>
  )
}

