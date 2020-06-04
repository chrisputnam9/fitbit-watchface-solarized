function Settings(props) {
    return (
        <Page>
            <Section
                title={<Text bold align="center">Solarized Settings</Text>}>
                
                <TextInput
                    label="Server URL"
                    settingsKey="server_url"
                />

            </Section>
        </Page>
    );
}

registerSettingsPage(Settings);
