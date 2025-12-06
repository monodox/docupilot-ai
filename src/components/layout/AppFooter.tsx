export default function AppFooter() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-4 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} CFML Auth. All rights reserved.</p>
      </div>
    </footer>
  );
}
