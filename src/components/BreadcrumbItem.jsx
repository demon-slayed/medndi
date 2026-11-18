export const BreadcrumbItem = ({ children, isLast }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center"
  >
    <span className={`${isLast ? 'text-gray-600' : 'text-[#3252DF] hover:text-[#4466ff] cursor-pointer'}`}>
      {children}
    </span>
    {!isLast && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
  </motion.div>
);
