"use client";

import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  RowData,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TransactionsSchema } from "@/helpers/schema";
import { z } from "zod";
import { CalendarIcon, Loader, Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
// import { Link, useLocation } from "react-router-dom";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

// Give our default column cell renderer editing superpowers!
const defaultColumn: Partial<ColumnDef<z.infer<typeof TransactionsSchema>>> = {
  cell: ({ getValue, row: { index }, column: { id }, table }) => {
    const initialValue = getValue();
    // We need to keep and update the state of the cell normally
    const [value, setValue] = useState(initialValue);
    // When the input is blurred, we'll call our table meta's updateData function
    const onBlur = () => {
      table.options.meta?.updateData(index, id, value);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
      setValue(initialValue);
    }, [initialValue]);
    return (
      <Input
        className="out-of-range:border-red-600"
        type={id == "amount" ? "number" : "text"}
        required
        value={value as string}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onBlur={onBlur}
      />
    );
  },
};

function useSkipper() {
  const shouldSkipRef = useRef(true);
  const shouldSkip = shouldSkipRef.current;

  // Wrap a function with this to skip a pagination reset temporarily
  const skip = useCallback(() => {
    shouldSkipRef.current = false;
  }, []);

  useEffect(() => {
    shouldSkipRef.current = true;
  });

  return [shouldSkip, skip] as const;
}

export default function CreateTransactions({
  trans,
  id,
  getAllUsers,
}: {
  trans: z.infer<typeof TransactionsSchema>[];
  id: number;
  getAllUsers: () => Promise<void>;
}) {
  const [data, setData] = useState<z.infer<typeof TransactionsSchema>[]>(trans);

  const [loading, setLoading] = useState(false);

  const updateType = (index: number, newValue: string) => {
    const newItems = [...data]; // Create a copy of the array
    newItems[index].type = newValue; // Modify the copy
    setData(newItems); // Update the state with the new array
  };

  const updateCategory = (index: number, newValue: string) => {
    const newItems = [...data]; // Create a copy of the array
    newItems[index].category = newValue; // Modify the copy
    setData(newItems); // Update the state with the new array
  };

  const updateDate = (index: number, newValue: Date) => {
    const newItems = [...data]; // Create a copy of the array
    newItems[index].date = newValue; // Modify the copy
    setData(newItems); // Update the state with the new array
  };

  const columns: ColumnDef<z.infer<typeof TransactionsSchema>>[] = [
    {
      accessorKey: "description",
      header: () => <span>Description</span>,
    },
    {
      accessorKey: "amount",
      header: () => <span>Amount</span>,
    },
    {
      accessorKey: "type",
      header: () => <span>Type</span>,
      cell: ({ getValue, row }) => {
        const initialValue = getValue();
        const [value, setValue] = useState(initialValue);
        useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);
        return (
          <Select
            value={value as string}
            onValueChange={(val) => {
              setValue(val);
              updateType(row.index, val);
            }}
            required
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Type</SelectLabel>
                <SelectItem value="Deposit">Deposit</SelectItem>
                <SelectItem value="Withdrawal">Withdrawal</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "category",
      header: () => <span>Category</span>,
      cell: ({ getValue, row }) => {
        const initialValue = getValue();
        const [value, setValue] = useState(initialValue);
        useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);
        return (
          <Select
            value={value as string}
            onValueChange={(val) => {
              setValue(val);
              updateCategory(row.index, val);
            }}
            required
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                <SelectItem value="Transfer">Transfer</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Subcription">Subcription</SelectItem>
                <SelectItem value="Internet">Internet</SelectItem>
                <SelectItem value="Electricity">Electricity</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ getValue, row }) => {
        const initialValue = getValue() as Date;
        const [value, setValue] = useState(initialValue);
        useEffect(() => {
          setValue(initialValue);
        }, [initialValue]);
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[180px] justify-start text-left font-normal",
                  !value && "text-muted-foreground"
                )}
              >
                <CalendarIcon />
                {value ? format(value, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={value}
                onSelect={(e) => {
                  updateDate(row.index, e!);
                  setValue(e!);
                }}
                required
                initialFocus
              />
            </PopoverContent>
          </Popover>
        );
      },
    },
    {
      header: "Delete",
      cell: ({ row }) => {
        return (
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setData((prevItems) => {
                return prevItems.filter((_, index) => index !== row.index);
              })
            }
          >
            <X className="text-orange-700" />
          </Button>
        );
      },
    },
  ];

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();

  const table = useReactTable({
    data,
    columns,
    defaultColumn,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    autoResetPageIndex,
    // Provide our updateData function to our table meta
    meta: {
      updateData: (rowIndex, columnId, value) => {
        // Skip page index reset until after next rerender
        skipAutoResetPageIndex();
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
    debugTable: true,
  });

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // const formValues = Object.fromEntries(e.currentTarget);
    const results = TransactionsSchema.extend({}).array().safeParse(data);
    console.log({ results });
    if (results.error) {
      toast.error(results.error.issues[0].message);
      return;
    }
    try {
      console.log({ data });
      setLoading(true);
      const res = await fetch(`/api/v1/admin/${id}/add-transactions`, {
        method: "PUT",
        body: JSON.stringify({ data: results.data }),
      });
      const response = await res.json();
      if (res.ok) {
        getAllUsers();
        toast.success("Transactions updated successfully");
        router.back();
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className="p-2" onSubmit={handleSubmit}>
        <h1 className="text-2xl mb-6 font-medium">Add transactions</h1>
        <Table>
          <TableHeader className="bg-primary text-primary-foreground">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-primary">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-white hover:bg-primary"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => {
              return (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Button
          type="button"
          onClick={() => {
            console.log({ data });
            setData((oldData) => [
              ...oldData,
              {
                amount: 0,
                date: "",
                category: "",
                description: "",
                type: "",
              },
            ]);
          }}
          //   disabled={isLoading}
          variant="outline"
          size="icon"
          className="mt-6 float-right flex item-center justify-center"
        >
          <Plus />
        </Button>
        <div className="flex gap-3 relative top-10 items-center">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            type="submit"
            // onClick={() => handleSubmit()}
            disabled={loading || data?.length == 0}
          >
            {loading && <Loader className="animate-spin mr-1" size={16} />}
            Create transactions
          </Button>
        </div>
      </form>
    </>
  );
}
