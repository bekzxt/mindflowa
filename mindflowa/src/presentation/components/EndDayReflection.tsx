import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
// Store needs update.

// For now, let's assume we implement the UI and the store action.

interface EndDayReflectionProps {
    onSubmit: (rating: 'yes' | 'partially' | 'no') => void;
}

export const EndDayReflection: React.FC<EndDayReflectionProps> = ({ onSubmit }) => {
    return (
        <Card className="glass-card mt-8 border-t-4 border-t-primary/20">
            <CardHeader>
                <CardTitle className="text-lg">End of Day Reflection</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">Did you follow your plan today?</p>
                <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 hover:bg-green-100 hover:text-green-800 hover:border-green-200" onClick={() => onSubmit('yes')}>Yes</Button>
                    <Button variant="outline" className="flex-1 hover:bg-yellow-100 hover:text-yellow-800 hover:border-yellow-200" onClick={() => onSubmit('partially')}>Partially</Button>
                    <Button variant="outline" className="flex-1 hover:bg-red-100 hover:text-red-800 hover:border-red-200" onClick={() => onSubmit('no')}>No</Button>
                </div>
            </CardContent>
        </Card>
    );
};
