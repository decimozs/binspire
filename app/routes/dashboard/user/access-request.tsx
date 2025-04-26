import {
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { email as nodemailer } from "@/lib/email";
import type { Route } from "./+types/access-request";
import db from "@/lib/db.server";
import { useFetcher, useLoaderData } from "react-router";
import { Button } from "@/components/ui/button";
import {
  CircleCheck,
  CircleX,
  Ellipsis,
  Mail,
  Phone,
  Timer,
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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { requestAccessTable } from "@/db";
import { eq } from "drizzle-orm";
import { render } from "@react-email/components";
import EmailInvitation from "@/components/email/email-invitation";
import { toast } from "sonner";
import { getSession } from "@/lib/sessions.server";
import RequestStatus from "@/components/shared/dynamic-table-cell";
import { fallbackInitials, formatDate } from "@/lib/utils";
import DynamicTableHeaderRow from "@/components/shared/dynamic-table-header-row";
import { tableRowColumns } from "@/lib/constants";
import { DynamicRoleBadge } from "@/components/shared/dynamic-badge";
import { TableContainer } from "@/components/shared/table-container";
import {
  ApproveUserAccessRequestContent,
  DeleteUserAccessRequestContent,
  RejectUserAccessRequestContent,
} from "@/components/shared/dialog-content";

export async function loader() {
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
  const accessControl = formData.get("access-control") as string;
  const session = await getSession(request.headers.get("cookie"));
  const orgId = session.get("orgId") as string;

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
        id={requestId}
        orgId={orgId}
        email={email}
        intent={intent}
        token={verification?.value as string}
        role={data.role as string}
        type={verification?.identifier as string}
        inviteFromIp="192.168.0.1"
        inviteFromLocation="Manila, Philippines"
        permission={accessControl}
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
        id={requestId}
        orgId={orgId}
        email={email}
        intent={intent}
        token={verification?.value as string}
        role={data.role as string}
        type={verification?.identifier as string}
        inviteFromIp="192.168.0.1"
        inviteFromLocation="Manila, Philippines"
        permission={accessControl}
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
  const { accessRequestTable } = tableRowColumns;
  const [approvedDialog, setApprovedDialog] = useState(false);
  const [rejectedDialog, setRejectedDialog] = useState(false);
  const [selectedAccess, setSelectedAccess] = useState("viewer");
  const [deletedDialog, setDeletedDialog] = useState(false);

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

  return (
    <TableContainer
      data={data || []}
      sorter={(a, b) => a.name.localeCompare(b.name)}
      defaultSortDirection="asc"
      searchFilter={(user, query) => {
        const q = query.toLowerCase();
        return (
          user.name.toLowerCase().includes(q) ||
          user.email.toLowerCase().includes(q) ||
          user.role.toLowerCase().includes(q) ||
          user.status.toLowerCase().includes(q)
        );
      }}
      dateFilter={(user, from, to) => {
        const createdAt = new Date(user.createdAt);
        return (!from || createdAt >= from) && (!to || createdAt <= to);
      }}
    >
      {({ paginatedData }) => (
        <>
          <TableHeader>
            <DynamicTableHeaderRow columns={accessRequestTable} />
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id} className="h-[50px]">
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.email}</TableCell>
                <TableCell>
                  <DynamicRoleBadge role={item.role} />
                </TableCell>
                <TableCell>
                  <RequestStatus status={item.status} />
                </TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <Sheet>
                    <DropdownMenu>
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
                            <DeleteUserAccessRequestContent
                              data={item}
                              fetcher={fetcher}
                            />
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
                                {fallbackInitials(item.name)}
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
                          <div className="flex flex-row gap-4">
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
                                {!item.phoneNumber
                                  ? "Not available"
                                  : item.phoneNumber}
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
                          <p className="text-sm">Reason for Access</p>
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
                          <ApproveUserAccessRequestContent
                            data={item}
                            fetcher={fetcher}
                            selectedAccess={selectedAccess}
                            setSelectedAccess={setSelectedAccess}
                          />
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
                          <RejectUserAccessRequestContent
                            data={item}
                            fetcher={fetcher}
                          />
                        </Dialog>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </>
      )}
    </TableContainer>
  );
}
