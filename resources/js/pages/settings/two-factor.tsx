import { Form, Head } from '@inertiajs/react';
import { ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import Heading from '@/components/heading';
import TwoFactorRecoveryCodes from '@/components/two-factor-recovery-codes';
import TwoFactorSetupModal from '@/components/two-factor-setup-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTwoFactorAuth } from '@/hooks/use-two-factor-auth';
import SettingsLayout from '@/layouts/settings/layout';
import { disable, enable } from '@/routes/two-factor';

type Props = {
    requiresConfirmation?: boolean;
    twoFactorEnabled?: boolean;
};

export default function TwoFactor({
    requiresConfirmation = false,
    twoFactorEnabled = false,
}: Props) {
    const {
        qrCodeSvg,
        hasSetupData,
        manualSetupKey,
        clearSetupData,
        fetchSetupData,
        recoveryCodesList,
        fetchRecoveryCodes,
        errors,
    } = useTwoFactorAuth();
    const [showSetupModal, setShowSetupModal] = useState<boolean>(false);

    return (
        <>
            <Head title="Two-Factor Authentication" />

            <div className="space-y-6">
                <Heading
                    variant="small"
                    title="Two-Factor Authentication"
                    description="Manage your two-factor authentication settings"
                />
                
                {twoFactorEnabled ? (
                    <div className="flex flex-col items-start justify-start space-y-4">
                        <Badge variant="default">Enabled</Badge>
                        <p className="text-sm text-muted-foreground">
                            With two-factor authentication enabled, you will
                            be prompted for a secure, random pin during
                            login.
                        </p>

                        <TwoFactorRecoveryCodes
                            recoveryCodesList={recoveryCodesList}
                            fetchRecoveryCodes={fetchRecoveryCodes}
                            errors={errors}
                        />

                        <div className="relative inline">
                            <Form {...disable.form()}>
                                {({ processing }) => (
                                    <Button
                                        variant="destructive"
                                        type="submit"
                                        disabled={processing}
                                    >
                                        <ShieldBan className="mr-2 h-4 w-4" /> Disable 2FA
                                    </Button>
                                )}
                            </Form>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-start justify-start space-y-4">
                        <Badge variant="destructive">Disabled</Badge>
                        <p className="text-sm text-muted-foreground">
                            When you enable two-factor authentication, you
                            will be prompted for a secure pin during login.
                        </p>

                        <div>
                            {hasSetupData ? (
                                <Button onClick={() => setShowSetupModal(true)}>
                                    <ShieldCheck className="mr-2 h-4 w-4" /> Continue Setup
                                </Button>
                            ) : (
                                <Form
                                    {...enable.form()}
                                    onSuccess={() => setShowSetupModal(true)}
                                >
                                    {({ processing }) => (
                                        <Button type="submit" disabled={processing}>
                                            <ShieldCheck className="mr-2 h-4 w-4" /> Enable 2FA
                                        </Button>
                                    )}
                                </Form>
                            )}
                        </div>
                    </div>
                )}

                <TwoFactorSetupModal
                    isOpen={showSetupModal}
                    onClose={() => setShowSetupModal(false)}
                    requiresConfirmation={requiresConfirmation}
                    twoFactorEnabled={twoFactorEnabled}
                    qrCodeSvg={qrCodeSvg}
                    manualSetupKey={manualSetupKey}
                    clearSetupData={clearSetupData}
                    fetchSetupData={fetchSetupData}
                    errors={errors}
                />
            </div>
        </>
    );
}

// Pasang layout agar sidebar dashboard muncul dan navbar publik hilang
TwoFactor.layout = (page: React.ReactNode) => (
    <SettingsLayout children={page} />
);