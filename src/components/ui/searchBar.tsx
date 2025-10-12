import { Button } from './button';
import { Input } from './input';

export const SearchBar = () => {
  return (
    <div className="flex justify-between items-center bg-slate-500  rounded-full px-4 py-2">
      <Input
        type="text"
        className="w-full min-w-[300px] mr-4 border-none  placeholder:text-black01"
        placeholder="키보드는 역시 WhiteWhale"
      />
      <Button
        type="submit"
        className="rounded-full w-10 h-10 bg-slate-400 border border-slate-400"
      >
        🔍
      </Button>
    </div>
  );
};

export default SearchBar;
