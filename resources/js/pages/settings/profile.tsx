import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SettingsLayout from '@/layouts/settings/layout';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import { send } from '@/routes/verification';

export default function Profile({ mustVerifyEmail, status }: { mustVerifyEmail: boolean; status?: string; }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="Profile settings" />
            <div className="space-y-6">
                <Heading variant="small" title="Profile information" description="Update your name and email address" />
                <Form {...ProfileController.update.form()} options={{ preserveScroll: true }} className="space-y-6">
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" className="mt-1 block w-full" defaultValue={auth.user.name} name="name" required placeholder="Full name" />
                                <InputError className="mt-2" message={errors.name} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email address</Label>
                                <Input id="email" type="email" className="mt-1 block w-full" defaultValue={auth.user.email} name="email" required placeholder="Email address" />
                                <InputError className="mt-2" message={errors.email} />
                            </div>
                            <div className="flex items-center gap-4">
                                <Button disabled={processing}>Save</Button>
                                <Transition show={recentlySuccessful} enter="transition ease-in-out" enterFrom="opacity-0" leave="transition ease-in-out" leaveTo="opacity-0">
                                    <p className="text-sm text-neutral-600">Saved</p>
                                </Transition>
                            </div>
                        </>
                    )}
                </Form>
            </div>
            <DeleteUser />
        </>
    );
}

Profile.layout = (page: React.ReactNode) => <SettingsLayout children={page} />;