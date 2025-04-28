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
import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
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
import { DeleteUserAccessRequestContent } from "@/components/shared/dialog-content";
import { ReviewUserAccessRequestContent } from "@/components/shared/sheet-content";

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
      data={data}
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
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                          <SheetTrigger>Review</SheetTrigger>
                        </DropdownMenuItem>
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
                    <ReviewUserAccessRequestContent
                      data={item}
                      fetcher={fetcher}
                      openApprovedDialog={approvedDialog}
                      onOpenChangeApprovedDialog={setApprovedDialog}
                      openRejectedDialog={rejectedDialog}
                      onOpenChangeRejectedDialog={setRejectedDialog}
                      onSelectedAccess={selectedAccess}
                      onSetSelectedAccess={setSelectedAccess}
                    />
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
