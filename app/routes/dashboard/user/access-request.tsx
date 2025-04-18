import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { email as nodemailer } from "@/lib/email";
import type { Route } from "./+types/access-request";
import db from "@/lib/db.server";
import { Form, useActionData, useFetcher, useLoaderData } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ChevronsRightLeftIcon,
  CircleCheck,
  CircleX,
  Clock,
  Ellipsis,
  Loader2,
  Mail,
  Phone,
  Timer,
  UserRound,
  UsersRound,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { requestAccessTable } from "@/db";
import { eq } from "drizzle-orm";
import { render } from "@react-email/components";
import EmailInvitation from "@/components/email/email-invitation";
import { toast } from "sonner";
import { useQueryState } from "nuqs";

export async function loader({ request }: Route.LoaderArgs) {
  const data = await db.query.requestAccessTable.findMany();

  return {
    data,
  };
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const requestId = formData.get("requestId") as string;
  const email = formData.get("email") as string;

  if (intent === "delete") {
    await db
      .delete(requestAccessTable)
      .where(eq(requestAccessTable.id, requestId));

    return {
      success: true,
      intent: intent,
    };
  }

  if (intent === "approved") {
    const [data] = await db
      .update(requestAccessTable)
      .set({
        status: intent,
      })
      .where(eq(requestAccessTable.id, requestId))
      .returning();

    const verification = await db.query.verificationsTable.findFirst({
      where: (table, { eq }) => eq(table.id, data.verificationId),
    });

    const emailHtml = await render(
      <EmailInvitation
        email={email}
        intent={intent}
        token={verification?.value as string}
        role={data.role as string}
        type={verification?.identifier as string}
        inviteFromIp="192.168.0.1"
        inviteFromLocation="Manila, Philippines"
      />,
    );

    const options = {
      from: "marlonadiguemartin548@gmail.com",
      to: "marlonadiguemartint548@gmail.com",
      subject: "Binspire Invitation Link",
      html: emailHtml,
    };

    try {
      await nodemailer.sendMail(options);
      return {
        success: true,
        intent: intent,
      };
    } catch (error) {
      return {
        errors: "Failed to send invitation link",
      };
    }
  }

  if (intent === "rejected") {
    const [data] = await db
      .update(requestAccessTable)
      .set({
        status: intent,
      })
      .where(eq(requestAccessTable.id, requestId))
      .returning();

    const verification = await db.query.verificationsTable.findFirst({
      where: (table, { eq }) => eq(table.id, data.verificationId),
    });

    const emailHtml = await render(
      <EmailInvitation
        email={email}
        intent={intent}
        token={verification?.value as string}
        role={data.role as string}
        type={verification?.identifier as string}
        inviteFromIp="192.168.0.1"
        inviteFromLocation="Manila, Philippines"
      />,
    );

    const options = {
      from: "marlonadiguemartin548@gmail.com",
      to: "marlonadiguemartint548@gmail.com",
      subject: "Binspire Invitation Link",
      html: emailHtml,
    };

    try {
      await nodemailer.sendMail(options);
      return {
        success: true,
        intent: intent,
      };
    } catch (error) {
      return {
        errors: "Failed to send invitation link",
      };
    }
  }

  return {
    success: false,
  };
}

export default function UserAccessRequestPage() {
  const { data } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [approvedDialog, setApprovedDialog] = useState(false);
  const [rejectedDialog, setRejectedDialog] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState("viewer");
  const [deletedDialog, setDeletedDialog] = useState(false);
  const [search, setSearch] = useQueryState("search");
  const [page, setPage] = useQueryState("page", {
    history: "push",
    defaultValue: "1",
  });
  const [limit, setLimit] = useQueryState("limit", {
    history: "push",
    defaultValue: "10",
  });

  useEffect(() => {
    if (fetcher.data?.success && fetcher.data?.intent === "approved") {
      toast.success("Request Approved");
      setApprovedDialog(false);
    }

    if (fetcher.data?.success && fetcher.data?.intent === "rejected") {
      toast.success("Request Rejected");
      setRejectedDialog(false);
    }

    if (fetcher.data?.success && fetcher.data?.intent === "delete") {
      toast.success("Request Deleted");
      setDeletedDialog(false);
    }
  }, [fetcher.data]);

  const pageNumber = parseInt(page || "1", 10);
  const pageSize = parseInt(limit || "10", 10);

  const filteredData = data.filter((user) => {
    const query = (search || "").toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query) ||
      user.status.toLowerCase().includes(query)
    );
  });

  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(Math.max(pageNumber, 1), totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div>
      <div className="mb-2 flex flex-row items-center justify-between">
        <Input
          className="w-[300px]"
          placeholder="What are you looking for?"
          type="search"
          value={search || ""}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage("1");
          }}
        />
      </div>
      <div className="w-full overflow-auto">
        <Table className="table-auto">
          <TableHeader className="sticky top-0 bg-background">
            <TableRow>
              <TableHead>
                <span className="flex flex-row gap-1 items-center">
                  <UserRound size={15} className="mt-[0.1rem]" />
                  Name
                </span>
              </TableHead>
              <TableHead>
                <span className="flex flex-row gap-1 items-center">
                  <Mail size={15} className="mt-[0.1rem]" />
                  Email
                </span>
              </TableHead>
              <TableHead>
                <span className="flex flex-row gap-1 items-center">
                  <UsersRound size={15} className="mt-[0.1rem]" />
                  Role
                </span>
              </TableHead>
              <TableHead>
                <span className="flex flex-row gap-1 items-center">
                  <Clock size={15} className="mt-[0.1rem]" />
                  Status
                </span>
              </TableHead>
              <TableHead>
                <span className="flex flex-row gap-1 items-center">
                  <Calendar size={15} className="mt-[0.1rem]" />
                  Requested At
                </span>
              </TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell className="capitalize">{item.role}</TableCell>
                <TableCell>
                  <span className="border-input border-[1px] rounded-sm p-1 px-2 font-medium text-[0.8rem] capitalize flex flex-row gap-1 items-center w-fit">
                    {item.status === "pending" && (
                      <Timer size={15} className="mb-0.5" />
                    )}
                    {item.status === "rejected" && (
                      <CircleX size={15} className="mb-0.5" />
                    )}
                    {item.status === "approved" && (
                      <CircleCheck size={15} className="mb-0.5" />
                    )}
                    {item.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(item.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost">
                          <Ellipsis />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="mr-8 mt-[-0.7rem]">
                        <DropdownMenuItem>
                          <SheetTrigger>Review</SheetTrigger>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Dialog
                            open={deletedDialog}
                            onOpenChange={setDeletedDialog}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="p-2 text-sm w-fit font-normal"
                              >
                                Delete
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>
                                  Delete access request?
                                </DialogTitle>
                                <p className="text-sm text-muted-foreground mb-[-0.5rem]">
                                  Deleting request for:
                                </p>
                                <div className="text-sm border-[1px] border-input p-4 rounded-md my-2 grid grid-cols-[70px_1fr]">
                                  <Avatar className="w-[50px] h-[50px]">
                                    <AvatarImage alt="@shadcn" />
                                    <AvatarFallback>
                                      {item.name
                                        .split(" ")
                                        .map((point) => point[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <p className="text-lg">{item.name}</p>
                                    <p className="text-sm text-muted-foreground capitalize flex flex-row gap-2 items-center">
                                      <Mail size={15} className="mt-[0.1rem]" />
                                      {item.email}
                                    </p>
                                  </div>
                                </div>
                                <DialogDescription>
                                  This action cannot be undone. This will
                                  permanently remove this user's access request
                                  from the system.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <fetcher.Form method="POST">
                                  <input
                                    type="hidden"
                                    name="intent"
                                    value="delete"
                                  />
                                  <input
                                    type="hidden"
                                    name="requestId"
                                    value={item.id}
                                  />
                                  <Button
                                    type="submit"
                                    disabled={fetcher.state !== "idle"}
                                  >
                                    {fetcher.state === "submitting" && (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {fetcher.state === "submitting"
                                      ? "Deleting..."
                                      : "Delete"}
                                  </Button>
                                </fetcher.Form>
                                <DialogClose asChild>
                                  <Button variant="outline">Cancel</Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <SheetContent
                      className="sm:max-w-md md:max-w-lg overflow-y-auto"
                      showOverlay={false}
                      onOpenAutoFocus={(event) => {
                        event.preventDefault();
                      }}
                    >
                      <SheetHeader>
                        <SheetTitle>Review</SheetTitle>
                        <SheetDescription>
                          This section displays the user's submitted
                          information, including their email and request status.
                          Carefully review the details before approving or
                          rejecting the request, as your decision cannot be
                          undone.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mx-4 border-[1px] border-input rounded-sm p-4">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-row items-center justify-between">
                            <SheetTitle>User Information</SheetTitle>
                            <Badge className="capitalize">
                              {item.status === "pending" && (
                                <Timer size={15} className="mb-0.5" />
                              )}
                              {item.status === "rejected" && (
                                <CircleX size={15} className="mb-0.5" />
                              )}
                              {item.status === "approved" && (
                                <CircleCheck size={15} className="mb-0.5" />
                              )}
                              {item.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-[70px_1fr] gap-4">
                            <Avatar className="w-[60px] h-[60px]">
                              <AvatarImage alt="@shadcn" />
                              <AvatarFallback>
                                {item.name
                                  .split(" ")
                                  .map((point) => point[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h1 className="text-lg font-medium">
                                {item.name}
                              </h1>
                              <p className="text-muted-foreground text-sm capitalize">
                                {item.role}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2">
                            <div className="flex flex-col gap-2">
                              <h1 className="text-sm text-muted-foreground">
                                Email
                              </h1>
                              <p className="text-sm flex flex-row gap-2 items-center">
                                <Mail size={15} className="mt-[0.2rem]" />
                                {item.email}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <h1 className="text-sm text-muted-foreground">
                                Phone Number
                              </h1>
                              <p className="text-sm flex flex-row gap-2 items-center">
                                <Phone size={15} className="mt-[0.2rem]" />
                                {item.phoneNumber}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mx-4 border-[1px] border-input rounded-sm p-4">
                        <div className="flex flex-col gap-4">
                          <SheetTitle>Request Details</SheetTitle>
                          <p className="text-muted-foreground text-sm mt-[-0.5rem]">
                            Requested on{" "}
                            {new Date(item.createdAt).toLocaleString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                          </p>
                          <p className="text-sm">Request for Access</p>
                          <div className="text-sm border-[1px] border-input p-4 rounded-md bg-muted/50">
                            <p>{item.reason}</p>
                          </div>
                        </div>
                      </div>
                      <SheetFooter className="grid grid-cols-2">
                        <Dialog
                          open={approvedDialog}
                          onOpenChange={setApprovedDialog}
                        >
                          <DialogTrigger asChild>
                            <Button className="h-12 p-4">
                              <CircleCheck className="mt-[0.1rem]" />
                              Approve
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Approve Access Request</DialogTitle>
                              <p className="text-sm text-muted-foreground mb-[-0.5rem]">
                                Approving access for:
                              </p>
                              <div className="text-sm border-[1px] border-input p-4 rounded-md my-2 grid grid-cols-[70px_1fr]">
                                <Avatar className="w-[50px] h-[50px]">
                                  <AvatarImage alt="@shadcn" />
                                  <AvatarFallback>
                                    {item.name
                                      .split(" ")
                                      .map((point) => point[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <p className="text-lg">{item.name}</p>
                                  <p className="text-sm text-muted-foreground capitalize flex flex-row gap-2 items-center">
                                    <Mail size={15} className="mt-[0.1rem]" />
                                    {item.email}
                                  </p>
                                </div>
                              </div>
                              <DialogDescription>
                                This user will be granted access to the
                                platform. You can’t undo this action after
                                confirming.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex flex-row justify-between">
                              <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium">
                                  Access Control
                                </p>
                                <Select
                                  value={selectedAccess}
                                  onValueChange={(value) => {
                                    setSelectedAccess(value);
                                    console.log("Selected access:", value);
                                  }}
                                >
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Viewer (Default)" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <SelectItem value="viewer">
                                            Viewer
                                          </SelectItem>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">
                                          <p>
                                            Can only view content and data.
                                            Cannot make any changes.
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <SelectItem value="editor">
                                            Editor
                                          </SelectItem>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">
                                          <p>
                                            Can view and edit content, but
                                            cannot manage users or permissions.
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                    <TooltipProvider>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <SelectItem value="full-access">
                                            Full Access
                                          </SelectItem>
                                        </TooltipTrigger>
                                        <TooltipContent side="left">
                                          <p>
                                            Has complete access to manage
                                            content, users, and settings.
                                          </p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </SelectContent>
                                </Select>
                              </div>
                              <DialogFooter className="mt-auto">
                                <fetcher.Form method="post">
                                  <input
                                    type="hidden"
                                    name="intent"
                                    value="approved"
                                  />
                                  <input
                                    type="hidden"
                                    name="requestId"
                                    value={item.id}
                                  />
                                  <input
                                    type="hidden"
                                    name="email"
                                    value={item.email}
                                  />
                                  <input
                                    type="hidden"
                                    name="access-control"
                                    value={selectedAccess}
                                  />
                                  <Button
                                    type="submit"
                                    disabled={fetcher.state !== "idle"}
                                  >
                                    {fetcher.state === "submitting" && (
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {fetcher.state === "submitting"
                                      ? "Approving..."
                                      : "Approve"}
                                  </Button>
                                </fetcher.Form>
                                <DialogClose>
                                  <Button type="submit" variant="outline">
                                    Cancel
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Dialog
                          open={rejectedDialog}
                          onOpenChange={setRejectedDialog}
                        >
                          <DialogTrigger asChild>
                            <Button className="h-12 p-4" variant="outline">
                              <CircleX className="mt-[0.1rem]" />
                              Reject
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Reject Access Request</DialogTitle>
                              <p className="text-sm text-muted-foreground mb-[-0.5rem]">
                                Rejecting access for:
                              </p>
                              <div className="text-sm border-[1px] border-input p-4 rounded-md my-2 grid grid-cols-[70px_1fr]">
                                <Avatar className="w-[50px] h-[50px]">
                                  <AvatarImage alt="@shadcn" />
                                  <AvatarFallback>
                                    {item.name
                                      .split(" ")
                                      .map((point) => point[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                  <p className="text-lg">{item.name}</p>
                                  <p className="text-sm text-muted-foreground capitalize flex flex-row gap-2 items-center">
                                    <Mail size={15} className="mt-[0.1rem]" />
                                    {item.email}
                                  </p>
                                </div>
                              </div>
                              <DialogDescription>
                                This user’s request will be denied. You can’t
                                undo this action after confirming.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <fetcher.Form method="post">
                                <input
                                  type="hidden"
                                  name="intent"
                                  value="rejected"
                                />
                                <input
                                  type="hidden"
                                  name="requestId"
                                  value={item.id}
                                />
                                <input
                                  type="hidden"
                                  name="email"
                                  value={item.email}
                                />
                                <Button
                                  type="submit"
                                  disabled={fetcher.state !== "idle"}
                                >
                                  {fetcher.state === "submitting" && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  {fetcher.state === "submitting"
                                    ? "Rejecting..."
                                    : "Reject"}
                                </Button>
                              </fetcher.Form>
                              <DialogClose>
                                <Button type="submit" variant="outline">
                                  Cancel
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-row items-center justify-between w-full">
        <p className="text-sm text-muted-foreground">
          {paginatedData.length} Results
        </p>
        <div className="flex flex-row items-center gap-2">
          <p className="mr-4 text-sm font-medium">
            Page {safePage} of {totalPages}
          </p>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage("1")}
            disabled={parseInt(page || "1") === 1}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() =>
              setPage((prev) => String(Math.max(1, parseInt(prev || "1") - 1)))
            }
            disabled={parseInt(page || "1") === 1}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((prev) => String(parseInt(prev || "1") + 1))}
            disabled={parseInt(page || "1") >= totalPages}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(String(totalPages))}
            disabled={parseInt(page || "1") >= totalPages}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
